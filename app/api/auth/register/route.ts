import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Simple validation
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }
    
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // For demo purposes, accept any registration
    // In production, this would save to the database and hash the password
    const user = {
      id: 'demo-user-id-' + Date.now(),
      email: body.email,
      name: body.name,
      role: 'user'
    };
    
    const accessToken = 'demo-access-token-' + Date.now();
    const refreshToken = 'demo-refresh-token-' + Date.now();
    
    const response = NextResponse.json({
      user,
      accessToken
    }, { status: 201 });
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}