import { Router, Request, Response, NextFunction } from 'express';
import { MongoUserRepository } from '../../../infrastructure/repositories/mongoUserRepository';
import { RegisterUserUseCase } from '../../../application/useCases/auth/registerUser';
import { AuthController } from '../controllers/authController';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validateFields } from '../middlewares/validationMiddleware';
import { ValidationError } from '../../../domain/exceptions/validationError';

const router = Router();
const userRepository = new MongoUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const authController = new AuthController(registerUserUseCase);

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const registerValidator = validateFields(['username', 'password', 'email']);
const loginValidator = validateFields(['username', 'password']);

router.post('/register', registerValidator, (req: Request, res: Response, next: NextFunction) => {
  try {
    authController.register(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);
    
    if (!user) {
      throw new ValidationError('Credenciales inválidas');
    }
    
    const valid = await bcrypt.compare(password, user.password);
    
    if (!valid) {
      throw new ValidationError('Credenciales inválidas');
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;