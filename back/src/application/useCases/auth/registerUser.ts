import { IUserRepository } from '../../../domain/repositories/iUserRepository';
import bcrypt from 'bcryptjs';

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(username: string, password: string) {
    const existing = await this.userRepository.findByUsername(username);
    if (existing) throw new Error('El usuario ya existe');
    const hashed = await bcrypt.hash(password, 10);
    return this.userRepository.create({ username, password: hashed });
  }
}