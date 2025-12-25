import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { LoginValidator } from '@/lib/auth/validators/AuthValidator';
import { ErrorHandler } from '@/lib/core/errors/ErrorHandler';
import { ValidationError } from '@/lib/core/errors/AppErrors';

export async function POST(req: NextRequest) {
  const errorHandler = new ErrorHandler();
  
  try {
    const body = await req.json();
    
    // Validate input
    const validator = new LoginValidator();
    const isValid = await validator.validate(body);
    
    if (!isValid) {
      throw new ValidationError('Validation failed', validator.getErrors());
    }
    
    // Parse validated data
    const validatedData = validator.parseData(body);
    
    // Login user
    const authService = new AuthService();
    const result = await authService.login(
      validatedData.email,
      validatedData.password
    );
    
    // Set cookies
    const response = NextResponse.json({
      user: result.user,
      accessToken: result.accessToken
    });
    
    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return response;
  } catch (error) {
    return errorHandler.handle(error as Error);
  }
}