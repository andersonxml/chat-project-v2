import Router from 'express';
import { authRouter } from '../modules/authentication/auth.route.js';
import { userRouter } from '../modules/user/user.route.js';

export const router = Router();

// Authentication routes
router.use('/auth', authRouter);

// User routes
router.use('/users', userRouter);
