import { z } from 'zod';
import { BaseValidator } from '@/lib/core/base/BaseValidator';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export class RegisterValidator extends BaseValidator<z.infer<typeof registerSchema>> {
  constructor() {
    super(registerSchema);
  }
}

export class LoginValidator extends BaseValidator<z.infer<typeof loginSchema>> {
  constructor() {
    super(loginSchema);
  }
}

export class RefreshTokenValidator extends BaseValidator<z.infer<typeof refreshTokenSchema>> {
  constructor() {
    super(refreshTokenSchema);
  }
}