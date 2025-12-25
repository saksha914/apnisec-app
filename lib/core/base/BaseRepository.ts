import { PrismaClient } from '@prisma/client';
import { IRepository } from '../interfaces/base.interfaces';

export abstract class BaseRepository<T> implements IRepository<T> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(prisma: PrismaClient, modelName: string) {
    this.prisma = prisma;
    this.model = (prisma as any)[modelName];
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id }
      });
    } catch (error) {
      throw new Error(`Failed to find by id: ${error}`);
    }
  }

  async findAll(filter: any = {}): Promise<T[]> {
    try {
      return await this.model.findMany(filter);
    } catch (error) {
      throw new Error(`Failed to find all: ${error}`);
    }
  }

  async create(data: any): Promise<T> {
    try {
      return await this.model.create({
        data
      });
    } catch (error) {
      throw new Error(`Failed to create: ${error}`);
    }
  }

  async update(id: string, data: any): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data
      });
    } catch (error) {
      throw new Error(`Failed to update: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.model.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to delete: ${error}`);
    }
  }
}