// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors';
import { MESSAGES } from '../constants/messages';
import { PERMISSIONS, PermissionGroup, PermissionAction } from '../constants/permissions';
import { IUserRole } from '../interfaces/common/roles.interface';

export const authorize = (permission: `${PermissionGroup}.${PermissionAction}`) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !user.role) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.USER_NOT_AUTHENTICATED);
        }

        const [group, action] = permission.split('.') as [PermissionGroup, PermissionAction];
        const allowedRoles = PERMISSIONS[group]?.[action];

        if (!allowedRoles || !allowedRoles.includes(user.role as IUserRole)) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
        }

        next();
    };
};