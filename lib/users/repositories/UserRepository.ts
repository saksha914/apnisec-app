import { PrismaClient, User } from '@prisma/client';
import { BaseRepository } from '@/lib/core/base/BaseRepository';
import { IUserRepository, UpdateUserDto } from '../interfaces/user.interfaces';

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.email !== undefined && { email: data.email })
        }
      });
    } catch (error) {
      throw new Error(`Failed to update user: ${error}`);
    }
  }
}