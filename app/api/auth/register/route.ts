import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { RegisterValidator } from '@/lib/auth/validators/AuthValidator';
import { ErrorHandler } from '@/lib/core/errors/ErrorHandler';
import { ValidationError } from '@/lib/core/errors/AppErrors';

export async function POST(req: NextRequest) {
  const errorHandler = new ErrorHandler();
  
  try {
    const body = await req.json();
    
    // Validate input
    const validator = new RegisterValidator();
    const isValid = await validator.validate(body);
    
    if (!isValid) {
      throw new ValidationError('Validation failed', validator.getErrors());
    }
    
    // Parse validated data
    const validatedData = validator.parseData(body);
    
    // Register user
    const authService = new AuthService();
    const result = await authService.register(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );
    
    // Set cookies
    const response = NextResponse.json({
      user: result.user,
      accessToken: result.accessToken
    }, { status: 201 });
    
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