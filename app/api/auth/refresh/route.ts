import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { ErrorHandler } from '@/lib/core/errors/ErrorHandler';
import { AuthenticationError } from '@/lib/core/errors/AppErrors';

export async function POST(req: NextRequest) {
  const errorHandler = new ErrorHandler();
  
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      throw new AuthenticationError('No refresh token provided');
    }
    
    // Refresh tokens
    const authService = new AuthService();
    const result = await authService.refreshToken(refreshToken);
    
    // Set new cookies
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