import { IUserRepository } from '../../domain/repositories/iUserRepository';
import { User } from '../../domain/entities/user';
import { UserModel } from '../database/models/userModel';

export class MongoUserRepository implements IUserRepository {
  async create(user: Omit<User, 'id'>): Promise<User> {
    const created = await UserModel.create(user);
    return { id: created._id.toString(), username: created.username, password: created.password };
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await UserModel.findOne({ username });
    if (!user) return null;
    return { id: user._id.toString(), username: user.username, password: user.password };
  }
}