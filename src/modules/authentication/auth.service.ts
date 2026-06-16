import dotenv from 'dotenv';
dotenv.config();

import type { LoginDTO, RegisterDTO } from './dto/auth.dto.js';
import { prisma } from '../../shared/database/prisma.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    async postRegister(data: RegisterDTO) {
        const userExists = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (userExists) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword
            }
        });

        return {
            message: 'User registered successfully',
            user: {
                name: user.name,
                email: user.email
            }
        };
    }

    async login(data: LoginDTO) {
        const userExists = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (!userExists) throw new Error('Invalid email or password');

        const password = await bcrypt.compare(data.password, userExists.password);
        if (!password) throw new Error('Invalid email or password');

        const accessToken = jwt.sign({ sub: userExists.id, role: userExists.role }, process.env.JWT_SECRET!, { expiresIn: '15m' });

        const RefreshToken = jwt.sign({ sub: userExists.id, role: userExists.role }, process.env.JWT_SECRET!, { expiresIn: '9h' });
        const hashRefreshToken = await bcrypt.hash(RefreshToken, 10);
        const date = new Date()
        const expiresAt = new Date(Date.now() + 9 * 60 * 60 * 1000)
        
        const addRefreshTokenDatabase = await prisma.refreshTokens.upsert({
            where: {
                user_id: userExists.id
            },
            update: {
                tokens: hashRefreshToken,
                expires_at: expiresAt
            },
            create: {
                user_id: userExists.id,
                tokens: hashRefreshToken,
                expires_at: expiresAt
            }
        })

        return {
            message: 'Login successful',
            user: {
                name: userExists.name,
                email: userExists.email
            },
            accessToken,
            hashRefreshToken
        };
    }
}