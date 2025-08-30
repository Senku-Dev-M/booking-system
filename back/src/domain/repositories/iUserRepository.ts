import { User } from '../entities/user';

export interface IUserRepository {
  create(user: Omit<User, 'id'>): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
}