import { NextRequest, NextResponse } from 'next/server';
import { BaseHandler } from '@/lib/core/base/BaseHandler';
import { IssueService } from '../services/IssueService';
import { CreateIssueValidator, UpdateIssueValidator, IssueFilterValidator } from '../validators/IssueValidator';
import { Issue } from '@prisma/client';
import { ValidationError } from '@/lib/core/errors/AppErrors';

export class IssueHandler extends BaseHandler<Issue> {
  private issueService: IssueService;

  constructor() {
    const service = new IssueService();
    super(service as any);
    this.issueService = service;
  }

  async handle(req: NextRequest): Promise<NextResponse> {
    const method = req.method;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extract user from context (added by auth middleware)
    const user = (req as any).user;

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Extract issue ID from path if present
    const issueId = pathParts.length >= 4 ? pathParts[3] : undefined;

    switch (method) {
      case 'GET':
        if (issueId) {
          return this.handleGetById(issueId, user.id);
        }
        return this.handleGetAll(req, user.id);
      case 'POST':
        return this.handleCreate(req, user.id);
      case 'PUT':
        if (!issueId) {
          return NextResponse.json(
            { error: 'Issue ID is required' },
            { status: 400 }
          );
        }
        return this.handleUpdate(req, issueId, user.id);
      case 'DELETE':
        if (!issueId) {
          return NextResponse.json(
            { error: 'Issue ID is required' },
            { status: 400 }
          );
        }
        return this.handleDeleteIssue(issueId, user.id);
      default:
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
    }
  }

  private async handleGetById(issueId: string, userId: string): Promise<NextResponse> {
    try {
      const issue = await this.issueService.getByIdForUser(issueId, userId);
      return NextResponse.json(issue);
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  private async handleGetAll(req: NextRequest, userId: string): Promise<NextResponse> {
    try {
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());
      
      // Validate filter
      const validator = new IssueFilterValidator();
      const validationResult = validator.safeParse(queryParams);
      
      if (!validationResult.success) {
        throw new ValidationError('Invalid filter parameters', validationResult.errors);
      }
      
      const result = await this.issueService.getAll(userId, validationResult.data || {});
      return NextResponse.json(result);
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  private async handleCreate(req: NextRequest, userId: string): Promise<NextResponse> {
    try {
      const body = await req.json();
      
      // Validate input
      const validator = new CreateIssueValidator();
      const isValid = await validator.validate(body);
      
      if (!isValid) {
        throw new ValidationError('Validation failed', validator.getErrors());
      }
      
      const validatedData = validator.parseData(body);
      const issue = await this.issueService.create(userId, validatedData);
      
      return NextResponse.json(issue, { status: 201 });
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  private async handleUpdate(req: NextRequest, issueId: string, userId: string): Promise<NextResponse> {
    try {
      const body = await req.json();
      
      // Validate input
      const validator = new UpdateIssueValidator();
      const isValid = await validator.validate(body);
      
      if (!isValid) {
        throw new ValidationError('Validation failed', validator.getErrors());
      }
      
      const validatedData = validator.parseData(body);
      const issue = await this.issueService.update(issueId, userId, validatedData);
      
      return NextResponse.json(issue);
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  private async handleDeleteIssue(issueId: string, userId: string): Promise<NextResponse> {
    try {
      await this.issueService.delete(issueId, userId);
      return NextResponse.json({ success: true }, { status: 204 });
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }
}