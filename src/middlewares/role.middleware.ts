// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';
import { IUserRole } from '../interfaces/common/roles.interface';
import { MESSAGES } from '../constants/messages';

export const authorize =
    (...allowedRoles: IUserRole[]) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const user = req.user; // este campo debe estar seteado previamente por authMiddleware

            if (!user || !allowedRoles.includes(user.role)) {
                throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
            }

            next();
        };
