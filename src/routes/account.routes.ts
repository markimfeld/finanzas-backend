import { Router } from "express";
// middleware
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateZod } from "../middlewares/validateZod";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";
import { auditMiddleware } from "../middlewares/audit.middleware";
// schemas
import { createAccountSchema } from "../validations/createAccount.schema";
// controllers
import { createAccount } from "../controllers/account.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("accounts.create"),
  validateZod(createAccountSchema),
  checkUserIsActive,
  auditMiddleware("create_budget"),
  createAccount
);

export default router;
