import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { AuthMiddleware } from '@/lib/auth/middleware/authMiddleware';
import { ErrorHandler } from '@/lib/core/errors/ErrorHandler';

export async function POST(req: NextRequest) {
  const errorHandler = new ErrorHandler();
  
  try {
    // Authenticate user
    const authMiddleware = new AuthMiddleware();
    const authResult = await authMiddleware.authenticate(req);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { user } = authResult;
    
    // Logout user
    const authService = new AuthService();
    await authService.logout(user.id);
    
    // Clear cookies
    const response = NextResponse.json({
      message: 'Logged out successfully'
    });
    
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    return errorHandler.handle(error as Error);
  }
}