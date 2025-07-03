import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors';
import { MESSAGES } from '../constants/messages';
import { userService } from '../services';

export const checkUserIsActive = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await userService.getUserById(req.user!.userId);

        if (!user.isActive) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTH.USER_INACTIVE);
        }

        next();
    } catch (error) {
        next(error);
    }
};
