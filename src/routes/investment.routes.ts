import { Router } from "express";
// middleware
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateZod } from "../middlewares/validateZod";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";
import { auditMiddleware } from "../middlewares/audit.middleware";
// controllers
import {
  createInvestment,
  deleteInvestmentById,
  getInvestments,
  updateInvestment,
} from "../controllers/investment.controller";
// validations
import { createInvestmentSchema } from "../validations/createInvestmentSchema";
import { updateInvestmentSchema } from "../validations/updateInvestmentSchema";
import { GetInvestmentsDtoSchema } from "../validations/getInvestments.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("investments.create"),
  validateZod(createInvestmentSchema),
  checkUserIsActive,
  auditMiddleware("create_investments"),
  createInvestment
);
router.put(
  "/:id",
  authMiddleware,
  authorize("investments.update"),
  validateZod(updateInvestmentSchema, "body"),
  checkUserIsActive,
  auditMiddleware("update_transaction"),
  updateInvestment
);
router.get(
  "/",
  authMiddleware,
  authorize("investments.read"),
  validateZod(GetInvestmentsDtoSchema, "query"),
  checkUserIsActive,
  auditMiddleware("get_all_investments"),
  getInvestments
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("investments.delete"),
  checkUserIsActive,
  auditMiddleware("delete_investments"),
  deleteInvestmentById
);

export default router;
