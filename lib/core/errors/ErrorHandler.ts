import { NextResponse } from 'next/server';
import { IErrorHandler } from '../interfaces/base.interfaces';
import { AppError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, RateLimitError } from './AppErrors';

export class ErrorHandler implements IErrorHandler {
  handle(error: Error): NextResponse {
    console.error('Error occurred:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          statusCode: error.statusCode
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof ConflictError) {
      return NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof RateLimitError) {
      const response = NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode,
          retryAfter: error.retryAfter
        },
        { status: error.statusCode }
      );
      
      response.headers.set('X-RateLimit-Limit', error.limit.toString());
      response.headers.set('X-RateLimit-Remaining', error.remaining.toString());
      response.headers.set('X-RateLimit-Reset', error.resetTime.toString());
      response.headers.set('Retry-After', error.retryAfter.toString());
      
      return response;
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode
        },
        { status: error.statusCode }
      );
    }

    // Default error response
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        message: error.message,
        statusCode: 500
      },
      { status: 500 }
    );
  }
}