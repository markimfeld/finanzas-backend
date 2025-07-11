import { Router } from 'express';
import { createCategory } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateZod } from '../middlewares/validateZod';
import { createCategorySchema } from '../validations/createCategory.schema';
import { authorize } from '../middlewares/role.middleware';
import { checkUserIsActive } from '../middlewares/checkUserIsActive';
import { auditMiddleware } from '../middlewares/audit.middleware';

const router = Router();

router.post(
    '/',
    authMiddleware,
    authorize("categories.create"),
    validateZod(createCategorySchema),
    checkUserIsActive,
    auditMiddleware('create_category'),
    createCategory
);

export default router;
