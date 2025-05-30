import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// errors
import { UnauthorizedError } from '../errors';
import { MESSAGES } from '../constants/messages';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Usá .env en producción

export interface AuthRequest extends Request {
    user?: any; // Podés tipar con IUserPayload si tenés definido
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError(MESSAGES.ERROR.AUTH.TOKEN_MISSING);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new UnauthorizedError(MESSAGES.ERROR.AUTH.TOKEN_INVALID);
    }
};
