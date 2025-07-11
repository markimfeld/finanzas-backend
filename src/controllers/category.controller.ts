import { Request, Response, NextFunction } from 'express';
// services
import { categoryService } from '../services';
// errors
import { ForbiddenError } from '../errors';
// messages
import { MESSAGES } from '../constants/messages';
// dtos
import { CreateCategoryDto } from '@/dtos/createCategory.dto';

export const createCategory = async (req: Request<{}, {}, CreateCategoryDto>, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;

        // validaciones de permisos
        if (!userId) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
        }

        const newCategory = await categoryService.createCategory(userId, req.body);

        res.status(201).json({
            success: true,
            data: newCategory,
            message: MESSAGES.SUCCESS.CATEGORY.CREATED
        });

    } catch (error) {
        next(error);
    }
};
