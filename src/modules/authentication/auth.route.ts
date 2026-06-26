import { authAdminMiddleware, authMiddleware, logoutMiddleware, refreshMiddleware } from '../../shared/middlewares/auth.middleware.js';
import {AuthController} from './auth.controller.js';
import { Router, type Request, type Response } from 'express';

const authController = new AuthController();
export const authRouter = Router();

authRouter.post('/register', authMiddleware, authAdminMiddleware, authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', refreshMiddleware ,authController.refresh)
authRouter.post('/logout/:id', authMiddleware, logoutMiddleware, authController.logout);

// authRouter.get('/protected/:id', authMiddleware, logoutMiddleware, (req: Request, res: Response) => {
//     res.json({ message: 'This is a protected route' });
// });