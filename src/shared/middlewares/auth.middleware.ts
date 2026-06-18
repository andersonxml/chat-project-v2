import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface JWTPayload {
    sub: string;
    role: string;
}

interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(400).json({ message: 'No authorization header provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No authorization' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'No authorization' });
    }
}

export const authAdminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role.toLowerCase() !== 'admin') return res.status(401).json({ message: 'No authorization' });
    next();
}

export const logoutMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Verify the params' })

    if (!req.user?.sub) return res.status(401).json({ message: 'User not logged' })

    if (Number(req.user?.sub) != Number(id)) return res.status(401).json({ message: 'No Authorization' })
    next()
}

export const refreshMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies;
    const token2 = req.headers;
    if (!token) return res.status(401).json({ message: 'No authorization' });
    try {
        jwt.verify(token.refreshToken, process.env.JWT_REFRESH_SECRET!)

        next()
    } catch (error) {
        return res.status(401).json({ message: 'No authorization' });
    }
}