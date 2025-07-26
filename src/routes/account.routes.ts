import { Router } from "express";
// middleware
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateZod } from "../middlewares/validateZod";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";
import { auditMiddleware } from "../middlewares/audit.middleware";
// schemas
import { createAccountSchema } from "../validations/createAccount.schema";
import { updateAccountSchema } from "../validations/updateAccount.schema";
// controllers
import {
  createAccount,
  updateAccount,
} from "../controllers/account.controller";

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
router.put(
  "/:id",
  authMiddleware,
  authorize("accounts.update"),
  validateZod(updateAccountSchema, "body"),
  checkUserIsActive,
  auditMiddleware("update_account"),
  updateAccount
);

export default router;
