export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export interface IService<T> {
  getById(id: string): Promise<T | null>;
  getAll(filter?: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export interface IHandler {
  handle(req: Request): Promise<Response>;
}

export interface IValidator {
  validate(data: any): Promise<boolean>;
  getErrors(): string[];
}

export interface IErrorHandler {
  handle(error: Error): Response;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}