import { Router } from "express";
import { createBudget, getAllUsers } from "../controllers/budget.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateZod } from "../middlewares/validateZod";
import { createBudgetSchema } from "../validations/createBudget.schema";
import { authorize } from "../middlewares/role.middleware";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";
import { auditMiddleware } from "../middlewares/audit.middleware";
import { GetBudgetsDtoSchema } from "../validations/getBudgets.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("budgets.create"),
  validateZod(createBudgetSchema),
  checkUserIsActive,
  auditMiddleware("create_budget"),
  createBudget
);
router.get(
  "/",
  authMiddleware,
  authorize("budgets.read"),
  validateZod(GetBudgetsDtoSchema, "query"),
  checkUserIsActive,
  auditMiddleware("get_all_budgets"),
  getAllUsers
);

export default router;
