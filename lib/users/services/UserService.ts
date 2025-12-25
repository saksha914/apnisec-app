import { PrismaClient } from '@prisma/client';
import { BaseService } from '@/lib/core/base/BaseService';
import { IUserService, UserProfile, UpdateUserDto } from '../interfaces/user.interfaces';
import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from '@/lib/auth/services/PasswordService';
import { NotFoundError, ValidationError, AuthenticationError, ConflictError } from '@/lib/core/errors/AppErrors';

export class UserService extends BaseService<UserProfile> implements IUserService {
  private userRepository: UserRepository;
  private passwordService: PasswordService;
  private prisma: PrismaClient;

  constructor() {
    const prisma = new PrismaClient();
    const repository = new UserRepository(prisma);
    super(repository as any);
    this.userRepository = repository;
    this.passwordService = new PasswordService();
    this.prisma = prisma;
  }

  async getProfile(userId: string): Promise<UserProfile> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async updateProfile(userId: string, data: UpdateUserDto): Promise<UserProfile> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // If email is being changed, check if new email is already taken
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail) {
        throw new ConflictError('Email is already in use');
      }
    }

    // Update user
    const updatedUser = await this.userRepository.update(userId, data);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    if (!oldPassword || !newPassword) {
      throw new ValidationError('Old password and new password are required');
    }

    if (newPassword.length < 8) {
      throw new ValidationError('New password must be at least 8 characters long');
    }

    // Get user with password
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify old password
    const isPasswordValid = await this.passwordService.verify(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.passwordService.hash(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
  }

  protected validateCreateData(data: any): void {
    // Not used for user service as users are created through AuthService
    throw new Error('Users should be created through AuthService');
  }

  protected validateUpdateData(data: any): void {
    if (data.email && !this.isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (data.name && data.name.length < 2) {
      throw new ValidationError('Name must be at least 2 characters long');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}