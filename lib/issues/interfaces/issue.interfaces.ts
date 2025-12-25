import { Issue, IssueType, IssueStatus, IssuePriority } from '@prisma/client';

export interface IIssueRepository {
  findById(id: string): Promise<Issue | null>;
  findAll(filter: IssueFilter): Promise<Issue[]>;
  findByUserId(userId: string, filter?: IssueFilter): Promise<Issue[]>;
  create(data: CreateIssueDto): Promise<Issue>;
  update(id: string, data: UpdateIssueDto): Promise<Issue>;
  delete(id: string): Promise<boolean>;
  count(filter: IssueFilter): Promise<number>;
}

export interface IIssueService {
  getById(id: string, userId: string): Promise<Issue>;
  getAll(userId: string, filter: IssueFilter): Promise<IssuePaginatedResponse>;
  create(userId: string, data: CreateIssueDto): Promise<Issue>;
  update(id: string, userId: string, data: UpdateIssueDto): Promise<Issue>;
  delete(id: string, userId: string): Promise<void>;
}

export interface CreateIssueDto {
  title: string;
  description: string;
  type: IssueType;
  priority?: IssuePriority;
  status?: IssueStatus;
  userId?: string;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  type?: IssueType;
  priority?: IssuePriority;
  status?: IssueStatus;
}

export interface IssueFilter {
  type?: IssueType;
  status?: IssueStatus;
  priority?: IssuePriority;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface IssuePaginatedResponse {
  issues: Issue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}