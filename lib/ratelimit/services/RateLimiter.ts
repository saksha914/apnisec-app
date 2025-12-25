import { PrismaClient } from '@prisma/client';
import { IRateLimiter, RateLimitResult, RateLimitConfig } from '../interfaces/ratelimit.interfaces';

export class RateLimiter implements IRateLimiter {
  private prisma: PrismaClient;
  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.prisma = new PrismaClient();
    this.config = {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
      ...config
    };
  }

  async checkLimit(identifier: string, userId?: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = new Date(now - this.config.windowMs);

    try {
      // Find existing rate limit record
      let rateLimit = await this.prisma.rateLimit.findUnique({
        where: { identifier }
      });

      // If no record exists or window has expired, create/reset
      if (!rateLimit || rateLimit.windowStart < windowStart) {
        rateLimit = await this.prisma.rateLimit.upsert({
          where: { identifier },
          update: {
            count: 1,
            windowStart: new Date(now),
            userId
          },
          create: {
            identifier,
            count: 1,
            windowStart: new Date(now),
            userId
          }
        });

        return {
          allowed: true,
          limit: this.config.maxRequests,
          remaining: this.config.maxRequests - 1,
          resetTime: now + this.config.windowMs
        };
      }

      // Check if limit exceeded
      if (rateLimit.count >= this.config.maxRequests) {
        const resetTime = rateLimit.windowStart.getTime() + this.config.windowMs;
        const retryAfter = Math.ceil((resetTime - now) / 1000);

        return {
          allowed: false,
          limit: this.config.maxRequests,
          remaining: 0,
          resetTime,
          retryAfter
        };
      }

      // Increment counter
      rateLimit = await this.prisma.rateLimit.update({
        where: { identifier },
        data: {
          count: rateLimit.count + 1
        }
      });

      const resetTime = rateLimit.windowStart.getTime() + this.config.windowMs;

      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests - rateLimit.count,
        resetTime
      };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // On error, allow the request but log it
      return {
        allowed: true,
        limit: this.config.maxRequests,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs
      };
    }
  }

  async resetLimit(identifier: string): Promise<void> {
    try {
      await this.prisma.rateLimit.delete({
        where: { identifier }
      });
    } catch (error) {
      // Ignore error if record doesn't exist
      console.error('Failed to reset rate limit:', error);
    }
  }

  // Clean up old rate limit records
  async cleanup(): Promise<void> {
    const windowStart = new Date(Date.now() - this.config.windowMs);
    
    try {
      await this.prisma.rateLimit.deleteMany({
        where: {
          windowStart: {
            lt: windowStart
          }
        }
      });
    } catch (error) {
      console.error('Failed to cleanup rate limits:', error);
    }
  }
}