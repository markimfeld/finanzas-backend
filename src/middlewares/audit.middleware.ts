import { Request, Response, NextFunction } from 'express';
import { AuditLogModel } from '../models/auditLog.model';

export const auditMiddleware = (action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId || null;

            const payload = { ...req.body };
            if (payload.passwordHash) delete payload.passwordHash;

            await AuditLogModel.create({
                userId,
                action,
                method: req.method,
                path: req.originalUrl,
                payload
            });
        } catch (error) {
            console.error('Error logging audit event:', error);
        }
        next();
    };
};