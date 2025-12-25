import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Simple validation
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // For demo purposes, accept any email/password combination
    // In production, this would validate against the database
    const user = {
      id: 'demo-user-id',
      email: body.email,
      name: body.email.split('@')[0],
      role: 'user'
    };
    
    const accessToken = 'demo-access-token-' + Date.now();
    const refreshToken = 'demo-refresh-token-' + Date.now();
    
    const response = NextResponse.json({
      user,
      accessToken
    });
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}