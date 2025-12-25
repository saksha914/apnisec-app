import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/AuthService';
import { AuthenticationError, AuthorizationError } from '@/lib/core/errors/AppErrors';

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async authenticate(req: NextRequest): Promise<{ user: any } | NextResponse> {
    const token = this.extractToken(req);

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    try {
      const payload = await this.authService.verifyToken(token);
      const user = await this.authService.getUserFromToken(token);

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        );
      }

      return { user };
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }

  async authorize(req: NextRequest, requiredRoles: string[]): Promise<{ user: any } | NextResponse> {
    const authResult = await this.authenticate(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    if (!requiredRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return { user };
  }

  private extractToken(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

export const withAuth = (
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  options?: { roles?: string[] }
) => {
  return async (req: NextRequest, context: any) => {
    const authMiddleware = new AuthMiddleware();
    
    const authResult = options?.roles
      ? await authMiddleware.authorize(req, options.roles)
      : await authMiddleware.authenticate(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Add user to context
    context.user = authResult.user;

    return handler(req, context);
  };
};