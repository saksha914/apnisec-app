import { NextRequest, NextResponse } from 'next/server';
import { IHandler, IService } from '../interfaces/base.interfaces';
import { ErrorHandler } from '../errors/ErrorHandler';

export abstract class BaseHandler<T> implements IHandler {
  protected service: IService<T>;
  protected errorHandler: ErrorHandler;

  constructor(service: IService<T>) {
    this.service = service;
    this.errorHandler = new ErrorHandler();
  }

  abstract handle(req: NextRequest): Promise<NextResponse>;

  protected async handleGet(req: NextRequest, id?: string): Promise<NextResponse> {
    try {
      if (id) {
        const result = await this.service.getById(id);
        if (!result) {
          return NextResponse.json(
            { error: 'Resource not found' },
            { status: 404 }
          );
        }
        return NextResponse.json(result);
      } else {
        const url = new URL(req.url);
        const filter = this.parseQueryParams(url.searchParams);
        const results = await this.service.getAll(filter);
        return NextResponse.json(results);
      }
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  protected async handlePost(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const result = await this.service.create(body);
      return NextResponse.json(result, { status: 201 });
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  protected async handlePut(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      const body = await req.json();
      const result = await this.service.update(id, body);
      return NextResponse.json(result);
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  protected async handleDelete(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      await this.service.delete(id);
      return NextResponse.json({ success: true }, { status: 204 });
    } catch (error) {
      return this.errorHandler.handle(error as Error);
    }
  }

  protected parseQueryParams(params: URLSearchParams): any {
    const filter: any = {};
    
    params.forEach((value, key) => {
      if (key === 'page' || key === 'limit') {
        filter[key] = parseInt(value, 10);
      } else {
        filter[key] = value;
      }
    });
    
    return filter;
  }
}