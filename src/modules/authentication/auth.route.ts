import { authAdminMiddleware, authMiddleware } from '../../shared/middlewares/auth.middleware.js';
import {AuthController} from './auth.controller.js';
import { Router, type Request } from 'express';

const authController = new AuthController();
export const authRouter = Router();

authRouter.post('/register', authMiddleware, authAdminMiddleware, authController.register);
authRouter.post('/login', authController.login);

// authRouter.get('/protected', authAdminMiddleware, (req: Request, res) => {
//     res.json({ message: 'This is a protected route' });
// });