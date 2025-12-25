import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { AuthenticationError, ValidationError } from '@/lib/core/errors/AppErrors';

export async function POST(req: NextRequest) {
  const authService = new AuthService();
  
  try {
    const body = await req.json();
    
    const result = await authService.login(body.email, body.password);
    
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
    console.error('Login error:', error);
    
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}