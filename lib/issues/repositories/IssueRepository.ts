import { PrismaClient, Issue, Prisma } from '@prisma/client';
import { BaseRepository } from '@/lib/core/base/BaseRepository';
import { IIssueRepository, CreateIssueDto, UpdateIssueDto, IssueFilter } from '../interfaces/issue.interfaces';

export class IssueRepository extends BaseRepository<Issue> implements IIssueRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'issue');
  }

  async findAll(filter: IssueFilter): Promise<Issue[]> {
    const where = this.buildWhereClause(filter);
    const orderBy = this.buildOrderBy(filter);
    const skip = filter.page && filter.limit ? (filter.page - 1) * filter.limit : undefined;
    const take = filter.limit;

    try {
      return await this.prisma.issue.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to find issues: ${error}`);
    }
  }

  async findByUserId(userId: string, filter?: IssueFilter): Promise<Issue[]> {
    const where = {
      userId,
      ...this.buildWhereClause(filter || {})
    };
    const orderBy = this.buildOrderBy(filter || {});
    const skip = filter?.page && filter?.limit ? (filter.page - 1) * filter.limit : undefined;
    const take = filter?.limit;

    try {
      return await this.prisma.issue.findMany({
        where,
        orderBy,
        skip,
        take
      });
    } catch (error) {
      throw new Error(`Failed to find user issues: ${error}`);
    }
  }

  async create(data: CreateIssueDto): Promise<Issue> {
    try {
      return await this.prisma.issue.create({
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          priority: data.priority || 'MEDIUM',
          status: data.status || 'OPEN',
          userId: data.userId!
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to create issue: ${error}`);
    }
  }

  async update(id: string, data: UpdateIssueDto): Promise<Issue> {
    try {
      return await this.prisma.issue.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.type !== undefined && { type: data.type }),
          ...(data.priority !== undefined && { priority: data.priority }),
          ...(data.status !== undefined && { status: data.status })
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to update issue: ${error}`);
    }
  }

  async count(filter: IssueFilter): Promise<number> {
    const where = this.buildWhereClause(filter);

    try {
      return await this.prisma.issue.count({ where });
    } catch (error) {
      throw new Error(`Failed to count issues: ${error}`);
    }
  }

  private buildWhereClause(filter: IssueFilter): Prisma.IssueWhereInput {
    const where: Prisma.IssueWhereInput = {};

    if (filter.type) {
      where.type = filter.type;
    }

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.priority) {
      where.priority = filter.priority;
    }

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } }
      ];
    }

    return where;
  }

  private buildOrderBy(filter: IssueFilter): Prisma.IssueOrderByWithRelationInput {
    if (filter.orderBy) {
      return {
        [filter.orderBy]: filter.order || 'desc'
      };
    }

    return { createdAt: 'desc' };
  }
}