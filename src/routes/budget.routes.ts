import { Router } from 'express';
import { createBudget } from '../controllers/budget.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateZod } from '../middlewares/validateZod';
import { createBudgetSchema } from '../validations/createBudget.schema';
import { authorize } from '../middlewares/role.middleware';
import { checkUserIsActive } from '../middlewares/checkUserIsActive';
import { auditMiddleware } from '../middlewares/audit.middleware';

const router = Router();

router.post(
    '/',
    authMiddleware,
    authorize("budgets.create"),
    validateZod(createBudgetSchema),
    checkUserIsActive,
    auditMiddleware('create_budget'),
    createBudget
);

export default router;
