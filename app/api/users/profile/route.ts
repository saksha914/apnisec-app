import { NextRequest, NextResponse } from 'next/server';

// Mock user data
const mockUser = {
  id: 'demo-user-id',
  email: 'user@example.com',
  name: 'Demo User',
  role: 'user',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(mockUser);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.email && !body.name) {
      return NextResponse.json(
        { error: 'At least one field must be provided' },
        { status: 400 }
      );
    }
    
    // Update mock user data
    const updatedUser = {
      ...mockUser,
      name: body.name || mockUser.name,
      email: body.email || mockUser.email,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}