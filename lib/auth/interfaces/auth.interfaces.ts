import { User } from '@prisma/client';

export interface IAuthService {
  register(email: string, password: string, name?: string): Promise<AuthResponse>;
  login(email: string, password: string): Promise<AuthResponse>;
  logout(userId: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  verifyToken(token: string): Promise<JWTPayload>;
  getUserFromToken(token: string): Promise<User | null>;
}

export interface AuthResponse {
  user: Omit<User, 'password' | 'refreshToken'>;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IPasswordService {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

export interface ITokenService {
  generateAccessToken(payload: JWTPayload): string;
  generateRefreshToken(payload: JWTPayload): string;
  verifyAccessToken(token: string): JWTPayload;
  verifyRefreshToken(token: string): JWTPayload;
}