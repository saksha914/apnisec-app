import { IRepository, IService } from '../interfaces/base.interfaces';

export abstract class BaseService<T> implements IService<T> {
  protected repository: IRepository<T>;

  constructor(repository: IRepository<T>) {
    this.repository = repository;
  }

  async getById(id: string): Promise<T | null> {
    if (!id) {
      throw new Error('ID is required');
    }
    return await this.repository.findById(id);
  }

  async getAll(filter?: any): Promise<T[]> {
    return await this.repository.findAll(filter);
  }

  async create(data: any): Promise<T> {
    this.validateCreateData(data);
    return await this.repository.create(data);
  }

  async update(id: string, data: any): Promise<T> {
    if (!id) {
      throw new Error('ID is required');
    }
    this.validateUpdateData(data);
    
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Resource not found');
    }
    
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('ID is required');
    }
    
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Resource not found');
    }
    
    return await this.repository.delete(id);
  }

  protected abstract validateCreateData(data: any): void;
  protected abstract validateUpdateData(data: any): void;
}