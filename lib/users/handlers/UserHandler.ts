import { NextRequest, NextResponse } from 'next/server';
import { BaseHandler } from '@/lib/core/base/BaseHandler';
import { UserService } from '../services/UserService';
import { UpdateProfileValidator, ChangePasswordValidator } from '../validators/UserValidator';
import { UserProfile } from '../interfaces/user.interfaces';
import { ValidationError } from '@/lib/core/errors/AppErrors';

export class UserHandler extends BaseHandler<UserProfile> {
  private userService: UserService;

  constructor() {
    const service = new UserService();
    super(service as any);
    this.userService = service;
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const method = req.method;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extract user from context (added by auth middleware)
    const user = (req as any).user;

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    switch (method) {
      case 'GET':
        return this.handleGetProfile(user.id);
      case 'PUT':
        if (pathParts.includes('password')) {
          return this.handleChangePassword(req, user.id);
        }
        return this.handleUpdateProfile(req, user.id);
      default:
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
    }
  }

  private async handleGetProfile(userId: string): Promise<NextResponse> {
    try {
      const profile = await this.userService.getProfile(userId);
      return NextResponse.json(profile);
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  private async handleUpdateProfile(req: NextRequest, userId: string): Promise<NextResponse> {
    try {
      const body = await req.json();
      
      // Validate input
      const validator = new UpdateProfileValidator();
      const isValid = await validator.validate(body);
      
      if (!isValid) {
        throw new ValidationError('Validation failed', validator.getErrors());
      }
      
      const validatedData = validator.parseData(body);
      const profile = await this.userService.updateProfile(userId, validatedData);
      
      return NextResponse.json(profile);
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  private async handleChangePassword(req: NextRequest, userId: string): Promise<NextResponse> {
    try {
      const body = await req.json();
      
      // Validate input
      const validator = new ChangePasswordValidator();
      const isValid = await validator.validate(body);
      
      if (!isValid) {
        throw new ValidationError('Validation failed', validator.getErrors());
      }
      
      const validatedData = validator.parseData(body);
      await this.userService.changePassword(
        userId,
        validatedData.oldPassword,
        validatedData.newPassword
      );
      
      return NextResponse.json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }
}