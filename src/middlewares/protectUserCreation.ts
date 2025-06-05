// src/middlewares/protectUserCreation.ts
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { authMiddleware } from './auth.middleware';
import { authorize } from './role.middleware';
import { PERMISSIONS } from '../constants/permissions';

export const protectUserCreation = async (req: Request, res: Response, next: NextFunction) => {
    const userCount = await UserModel.countDocuments();

    if (userCount === 0) {
        // Permitir crear el primer usuario sin autenticación
        return next();
    }

    // Si ya hay usuarios, aplicar auth + authorize
    return authMiddleware(req, res, (err) => {
        if (err) return next(err);
        return authorize('users.create')(req, res, next);
    });
};
