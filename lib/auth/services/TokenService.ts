import jwt from 'jsonwebtoken';
import { ITokenService, JWTPayload } from '../interfaces/auth.interfaces';

export class TokenService implements ITokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'default-secret-change-this';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-this';
    this.accessTokenExpiry = process.env.JWT_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

    if (process.env.NODE_ENV === 'production' && 
        (this.accessTokenSecret === 'default-secret-change-this' || 
         this.refreshTokenSecret === 'default-refresh-secret-change-this')) {
      throw new Error('JWT secrets must be set in production');
    }
  }

  generateAccessToken(payload: JWTPayload): string {
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };
    
    return jwt.sign(tokenPayload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };
    
    return jwt.sign(tokenPayload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry
    });
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }
}