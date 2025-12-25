import { NextRequest, NextResponse } from 'next/server';
import { UserHandler } from '@/lib/users/handlers/UserHandler';
import { AuthMiddleware } from '@/lib/auth/middleware/authMiddleware';

export async function GET(req: NextRequest) {
  // Authenticate user
  const authMiddleware = new AuthMiddleware();
  const authResult = await authMiddleware.authenticate(req);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  // Add user to request
  (req as any).user = authResult.user;
  
  // Handle request
  const handler = new UserHandler();
  return handler.handle(req);
}

export async function PUT(req: NextRequest) {
  // Authenticate user
  const authMiddleware = new AuthMiddleware();
  const authResult = await authMiddleware.authenticate(req);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  // Add user to request
  (req as any).user = authResult.user;
  
  // Handle request
  const handler = new UserHandler();
  return handler.handle(req);
}