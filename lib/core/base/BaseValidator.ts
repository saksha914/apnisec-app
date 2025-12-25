import { IValidator } from '../interfaces/base.interfaces';
import { z, ZodError, ZodSchema } from 'zod';

export abstract class BaseValidator<T> implements IValidator {
  protected errors: string[] = [];
  protected schema: ZodSchema<T>;

  constructor(schema: ZodSchema<T>) {
    this.schema = schema;
  }

  async validate(data: any): Promise<boolean> {
    this.errors = [];
    
    try {
      await this.schema.parseAsync(data);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        this.errors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
      } else {
        this.errors = ['Validation failed'];
      }
      return false;
    }
  }

  getErrors(): string[] {
    return this.errors;
  }

  parseData(data: any): T {
    return this.schema.parse(data);
  }

  safeParse(data: any): { success: boolean; data?: T; errors?: string[] } {
    try {
      const parsedData = this.schema.parse(data);
      return { success: true, data: parsedData };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        return { success: false, errors };
      }
      return { success: false, errors: ['Validation failed'] };
    }
  }
}