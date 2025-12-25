import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from '../services/RateLimiter';
import { RateLimitError } from '@/lib/core/errors/AppErrors';
import { AuthService } from '@/lib/auth/services/AuthService';

export class RateLimitMiddleware {
  private rateLimiter: RateLimiter;
  private authService: AuthService;

  constructor() {
    this.rateLimiter = new RateLimiter();
    this.authService = new AuthService();
  }

  async limit(req: NextRequest): Promise<NextResponse | null> {
    // Get identifier (IP address or user ID)
    const identifier = await this.getIdentifier(req);

    // Check rate limit
    const result = await this.rateLimiter.checkLimit(identifier);

    // Add rate limit headers to response
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', result.limit.toString());
    headers.set('X-RateLimit-Remaining', result.remaining.toString());
    headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

    if (!result.allowed) {
      headers.set('Retry-After', result.retryAfter!.toString());
      
      const error = new RateLimitError(
        'Too many requests, please try again later',
        result.limit,
        result.remaining,
        result.resetTime
      );

      return NextResponse.json(
        {
          error: error.message,
          retryAfter: result.retryAfter,
          resetTime: new Date(result.resetTime).toISOString()
        },
        { 
          status: 429,
          headers
        }
      );
    }

    // Return null to indicate request should proceed
    return null;
  }

  private async getIdentifier(req: NextRequest): Promise<string> {
    // Try to get user ID from token
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const user = await this.authService.getUserFromToken(token);
        if (user) {
          return `user:${user.id}`;
        }
      } catch {
        // Fall back to IP if token is invalid
      }
    }

    // Fall back to IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 
               req.headers.get('x-real-ip') || 
               'unknown';
    
    return `ip:${ip}`;
  }
}

export const withRateLimit = (
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context?: any) => {
    const rateLimitMiddleware = new RateLimitMiddleware();
    
    // Check rate limit
    const rateLimitResponse = await rateLimitMiddleware.limit(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Proceed with the original handler
    const response = await handler(req, context);

    // Add rate limit headers to successful responses
    const identifier = await rateLimitMiddleware['getIdentifier'](req);
    const result = await rateLimitMiddleware['rateLimiter'].checkLimit(identifier);

    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, result.remaining - 1).toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

    return response;
  };
};