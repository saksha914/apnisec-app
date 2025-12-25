import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/auth/middleware/authMiddleware';
import { RateLimitMiddleware } from '@/lib/ratelimit/middleware/rateLimitMiddleware';

export const withApiMiddleware = async (
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: { 
    requireAuth?: boolean;
    roles?: string[];
    rateLimit?: boolean;
  }
) => {
  const { requireAuth = true, roles, rateLimit = true } = options || {};

  // Apply rate limiting
  if (rateLimit) {
    const rateLimitMiddleware = new RateLimitMiddleware();
    const rateLimitResponse = await rateLimitMiddleware.limit(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // Apply authentication
  if (requireAuth) {
    const authMiddleware = new AuthMiddleware();
    const authResult = roles
      ? await authMiddleware.authorize(req, roles)
      : await authMiddleware.authenticate(req);

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Add user to request
    (req as any).user = authResult.user;
  }

  // Execute handler
  const response = await handler(req);

  // Add rate limit headers to response if rate limiting is enabled
  if (rateLimit) {
    const rateLimitMiddleware = new RateLimitMiddleware();
    const identifier = await (rateLimitMiddleware as any).getIdentifier(req);
    const rateLimiter = (rateLimitMiddleware as any).rateLimiter;
    const result = await rateLimiter.checkLimit(identifier);

    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, result.remaining - 1).toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
  }

  return response;
};