import { User } from '@prisma/client';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<boolean>;
}

export interface IUserService {
  getProfile(userId: string): Promise<UserProfile>;
  updateProfile(userId: string, data: UpdateUserDto): Promise<UserProfile>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}