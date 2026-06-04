import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { z } from "zod";

const editUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    role: z
        .string()
        .transform(v => v.toLowerCase())
        .pipe(z.enum(['USER', 'SAC', 'ADMIN']))
        .optional()
});

export class UserController {
    constructor(
        private userService = new UserService()
    ) { }
    users = async (req: Request, res: Response) => {
        try {
            const result = await this.userService.getAllUsers();
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    edit = async (req: Request, res: Response) => {
        try {
            const body = editUserSchema.safeParse(req.body);
            if (!body.success) return res.status(400).json({ message: 'Check the fields.' })
            
            const result = await this.userService.editUser(body.data);

            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    delete = async (req: Request, res: Response) => {
        try {
            const email = req.params.email;
            if (!email) return res.status(400).json({ message: 'User ID is required.' });

            const result = await this.userService.deleteUser(String(email));

            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}