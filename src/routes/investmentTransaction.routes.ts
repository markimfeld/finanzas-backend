import { Router } from "express";
// middleware
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateZod } from "../middlewares/validateZod";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";
import { auditMiddleware } from "../middlewares/audit.middleware";
// controllers
import {
  createInvestmentTransaction,
  deleteInvestmentTransactionById,
  getInvestmentTransactions,
  updateInvestmentTransaction,
} from "../controllers/investmentTransaction.controller";
// validations
import { createInvestmentTransactionSchema } from "../validations/createInvestmentTransactionSchema";
import { updateInvestmentTransactionSchema } from "../validations/updateInvestmentTransactionSchema";
import { GetInvestmentTransactionsDtoSchema } from "../validations/getInvestmentTransactions.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("investmentTransactions.create"),
  validateZod(createInvestmentTransactionSchema),
  checkUserIsActive,
  auditMiddleware("create_investment_transaction"),
  createInvestmentTransaction
);
router.put(
  "/:id",
  authMiddleware,
  authorize("investmentTransactions.update"),
  validateZod(updateInvestmentTransactionSchema, "body"),
  checkUserIsActive,
  auditMiddleware("update_investment"),
  updateInvestmentTransaction
);
router.get(
  "/",
  authMiddleware,
  authorize("investmentTransactions.read"),
  validateZod(GetInvestmentTransactionsDtoSchema, "query"),
  checkUserIsActive,
  auditMiddleware("get_all_investment_transactions"),
  getInvestmentTransactions
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("investmentTransactions.delete"),
  checkUserIsActive,
  auditMiddleware("delete_investment_transaction"),
  deleteInvestmentTransactionById
);

export default router;
