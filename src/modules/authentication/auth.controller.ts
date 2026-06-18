import type { Request, Response } from 'express'
import { z } from 'zod'
import { AuthService } from './auth.service.js';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
const registerSchema = loginSchema.extend({
    name: z.string().min(2)
})

export class AuthController {
    constructor(
        private authService = new AuthService()
    ) { }
    register = async (req: Request, res: Response) => {
        try {
            const body = registerSchema.safeParse(req.body);
            if (!body.success) return res.status(400).json({ message: 'Check the fields.' });

            const result = await this.authService.register(body.data);

            res.status(201).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }

    login = async (req: Request, res: Response) => {
        try {          
            const body = loginSchema.safeParse(req.body);
            if (!body.success) return res.status(400).json({ message: 'Check the fields.' });

            const result = await this.authService.login(body.data);

            res.cookie('refreshToken', result.RefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                domain: 'localhost',
                maxAge: 9 * 60 * 60 * 1000
            });

            res.status(200).json({
                user: result.user,
                accessToken: result.accessToken
            });
        } catch (error: any) {
            res.status(500).json({ message: error || 'Internal server error' });
        }
    }

    logout = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            if (!id) return res.status(400).json({ message: 'Check the fields.' });
            const result = await this.authService.logout({ id: id });

            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }

    refresh = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const result = await this.authService.refresh({id: 3});
        
            res.status(200).json(result)
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }
}