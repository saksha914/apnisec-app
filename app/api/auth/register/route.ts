import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth/services/AuthService';
import { ValidationError, ConflictError } from '@/lib/core/errors/AppErrors';

export async function POST(req: NextRequest) {
  const authService = new AuthService();
  
  try {
    const body = await req.json();
    
    const result = await authService.register(body.email, body.password, body.name);
    
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
    console.error('Registration error:', error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}