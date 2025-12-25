import { PrismaClient, Issue } from '@prisma/client';
import { BaseService } from '@/lib/core/base/BaseService';
import { IIssueService, CreateIssueDto, UpdateIssueDto, IssueFilter, IssuePaginatedResponse } from '../interfaces/issue.interfaces';
import { IssueRepository } from '../repositories/IssueRepository';
import { EmailService } from '@/lib/email/services/EmailService';
import { NotFoundError, ValidationError, AuthorizationError } from '@/lib/core/errors/AppErrors';

export class IssueService extends BaseService<Issue> implements IIssueService {
  private issueRepository: IssueRepository;
  private prisma: PrismaClient;
  private emailService: EmailService;

  constructor() {
    const prisma = new PrismaClient();
    const repository = new IssueRepository(prisma);
    super(repository as any);
    this.issueRepository = repository;
    this.prisma = prisma;
    this.emailService = new EmailService();
  }

  async getByIdForUser(id: string, userId: string): Promise<Issue> {
    if (!id) {
      throw new ValidationError('Issue ID is required');
    }

    const issue = await this.issueRepository.findById(id);
    
    if (!issue) {
      throw new NotFoundError('Issue not found');
    }

    // Check if user has permission to view this issue
    if (issue.userId !== userId) {
      throw new AuthorizationError('You do not have permission to view this issue');
    }

    return issue;
  }

  async getAllForUser(userId: string, filter: IssueFilter): Promise<IssuePaginatedResponse> {
    // Set default pagination values
    const page = filter.page || 1;
    const limit = filter.limit || 10;

    // Get issues for the user
    const issues = await this.issueRepository.findByUserId(userId, {
      ...filter,
      page,
      limit
    });

    // Get total count
    const total = await this.issueRepository.count({
      ...filter,
      page: undefined,
      limit: undefined
    });

    const totalPages = Math.ceil(total / limit);

    return {
      issues,
      total,
      page,
      limit,
      totalPages
    };
  }

  async createForUser(userId: string, data: CreateIssueDto): Promise<Issue> {
    this.validateCreateData(data);

    // Add userId to the data
    const issueData = {
      ...data,
      userId
    };

    const issue = await this.issueRepository.create(issueData);

    // Get user email for notification
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (user) {
      // Send issue created email (don't await to avoid blocking)
      this.emailService.sendIssueCreatedEmail(user.email, {
        title: issue.title,
        description: issue.description,
        type: issue.type,
        priority: issue.priority,
        status: issue.status,
        createdBy: user.name || user.email
      }).catch(error => {
        console.error('Failed to send issue created email:', error);
      });
    }

    return issue;
  }

  async updateForUser(id: string, userId: string, data: UpdateIssueDto): Promise<Issue> {
    if (!id) {
      throw new ValidationError('Issue ID is required');
    }

    this.validateUpdateData(data);

    // Check if issue exists and user has permission
    const existingIssue = await this.issueRepository.findById(id);
    
    if (!existingIssue) {
      throw new NotFoundError('Issue not found');
    }

    if (existingIssue.userId !== userId) {
      throw new AuthorizationError('You do not have permission to update this issue');
    }

    return await this.issueRepository.update(id, data);
  }

  async deleteForUser(id: string, userId: string): Promise<void> {
    if (!id) {
      throw new ValidationError('Issue ID is required');
    }

    // Check if issue exists and user has permission
    const existingIssue = await this.issueRepository.findById(id);
    
    if (!existingIssue) {
      throw new NotFoundError('Issue not found');
    }

    if (existingIssue.userId !== userId) {
      throw new AuthorizationError('You do not have permission to delete this issue');
    }

    await this.issueRepository.delete(id);
  }

  protected validateCreateData(data: CreateIssueDto): void {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (data.title.length < 3) {
      errors.push('Title must be at least 3 characters long');
    } else if (data.title.length > 200) {
      errors.push('Title must not exceed 200 characters');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Description is required');
    } else if (data.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!data.type) {
      errors.push('Issue type is required');
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }
  }

  protected validateUpdateData(data: UpdateIssueDto): void {
    const errors: string[] = [];

    if (data.title !== undefined) {
      if (data.title.trim().length === 0) {
        errors.push('Title cannot be empty');
      } else if (data.title.length < 3) {
        errors.push('Title must be at least 3 characters long');
      } else if (data.title.length > 200) {
        errors.push('Title must not exceed 200 characters');
      }
    }

    if (data.description !== undefined) {
      if (data.description.trim().length === 0) {
        errors.push('Description cannot be empty');
      } else if (data.description.length < 10) {
        errors.push('Description must be at least 10 characters long');
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }
  }
}