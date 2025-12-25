import { z } from 'zod';
import { BaseValidator } from '@/lib/core/base/BaseValidator';
import { IssueType, IssueStatus, IssuePriority } from '@prisma/client';

const createIssueSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  type: z.nativeEnum(IssueType),
  priority: z.nativeEnum(IssuePriority).optional().default('MEDIUM'),
  status: z.nativeEnum(IssueStatus).optional().default('OPEN'),
});

const updateIssueSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .optional(),
  type: z.nativeEnum(IssueType).optional(),
  priority: z.nativeEnum(IssuePriority).optional(),
  status: z.nativeEnum(IssueStatus).optional(),
});

const issueFilterSchema = z.object({
  type: z.nativeEnum(IssueType).optional(),
  status: z.nativeEnum(IssueStatus).optional(),
  priority: z.nativeEnum(IssuePriority).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  orderBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority', 'status']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export class CreateIssueValidator extends BaseValidator<z.infer<typeof createIssueSchema>> {
  constructor() {
    super(createIssueSchema);
  }
}

export class UpdateIssueValidator extends BaseValidator<z.infer<typeof updateIssueSchema>> {
  constructor() {
    super(updateIssueSchema);
  }
}

export class IssueFilterValidator extends BaseValidator<z.infer<typeof issueFilterSchema>> {
  constructor() {
    super(issueFilterSchema);
  }
}