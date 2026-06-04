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
    if (!authHeader) return res.status(401).json({ message: 'No authorization header provided' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No authorization' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'No authorization' });
    }
}

export const authAdminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No authorization header provided' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No authorization' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        req.user = payload;
        const decodedToken = jwt.decode(token) as JWTPayload;
        if (decodedToken.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        } 

        next();
    } catch (error) {
        return res.status(401).json({ message: 'No authorization' });
    }
}