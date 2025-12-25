import bcrypt from 'bcryptjs';
import { IPasswordService } from '../interfaces/auth.interfaces';

export class PasswordService implements IPasswordService {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required');
    }
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    return await bcrypt.hash(password, this.saltRounds);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      return false;
    }
    
    return await bcrypt.compare(password, hash);
  }
}