import { User } from '@prisma/client';
import { prisma } from '@/lib/database/prisma';
import { IAuthService, AuthResponse, JWTPayload } from '../interfaces/auth.interfaces';
import { PasswordService } from './PasswordService';
import { TokenService } from './TokenService';
import { EmailService } from '@/lib/email/services/EmailService';
import { AuthenticationError, ConflictError, ValidationError } from '@/lib/core/errors/AppErrors';

export class AuthService implements IAuthService {
  private passwordService: PasswordService;
  private tokenService: TokenService;
  private emailService: EmailService;

  constructor() {
    try {
      this.passwordService = new PasswordService();
      this.tokenService = new TokenService();
      this.emailService = new EmailService();
    } catch (error) {
      console.error('Failed to initialize AuthService:', error);
      throw error;
    }
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    if (!this.isValidEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    // Save refresh token to database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Send welcome email (don't await to avoid blocking registration)
    this.emailService.sendWelcomeEmail(user.email, user.name || 'User').catch(error => {
      console.error('Failed to send welcome email:', error);
    });

    // Return response without sensitive data
    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return {
      user: userWithoutSensitiveData,
      accessToken,
      refreshToken
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.verify(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    // Save refresh token to database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Return response without sensitive data
    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return {
      user: userWithoutSensitiveData,
      accessToken,
      refreshToken
    };
  }

  async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    // Verify refresh token
    let payload: JWTPayload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Find user with this refresh token
    const user = await prisma.user.findFirst({
      where: {
        id: payload.userId,
        refreshToken
      }
    });

    if (!user) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Generate new tokens
    const newPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const newAccessToken = this.tokenService.generateAccessToken(newPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(newPayload);

    // Update refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken }
    });

    // Return response without sensitive data
    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return {
      user: userWithoutSensitiveData,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    return this.tokenService.verifyAccessToken(token);
  }

  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const payload = this.tokenService.verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}