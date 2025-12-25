import { z } from 'zod';
import { BaseValidator } from '@/lib/core/base/BaseValidator';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export class UpdateProfileValidator extends BaseValidator<z.infer<typeof updateProfileSchema>> {
  constructor() {
    super(updateProfileSchema);
  }
}

export class ChangePasswordValidator extends BaseValidator<z.infer<typeof changePasswordSchema>> {
  constructor() {
    super(changePasswordSchema);
  }
}