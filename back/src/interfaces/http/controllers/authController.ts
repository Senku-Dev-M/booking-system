import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/useCases/auth/registerUser';

export class AuthController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  async register(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      await this.registerUserUseCase.execute(username, password);
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }
}