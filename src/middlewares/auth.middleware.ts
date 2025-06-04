import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// errors
import { UnauthorizedError } from '../errors';
import { MESSAGES } from '../constants/messages';
import { JwtPayload } from '../interfaces/auth/jwtPayload.interface';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export interface AuthRequest extends Request {
    user?: JwtPayload; // Podés tipar con IUserPayload si tenés definido
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError(MESSAGES.ERROR.AUTH.TOKEN_MISSING);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        throw new UnauthorizedError(MESSAGES.ERROR.AUTH.TOKEN_INVALID);
    }
};
