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
  deleteAccountById,
  getAccounts,
  updateAccount,
} from "../controllers/account.controller";
import { GetAccountsDtoSchema } from "../validations/getAccounts.schema";
import { createTransactionSchema } from "../validations/createTransactionSchema";
import { createTransaction } from "../controllers/transaction.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("transactions.create"),
  validateZod(createTransactionSchema),
  checkUserIsActive,
  auditMiddleware("create_transaction"),
  createTransaction
);
// router.put(
//   "/:id",
//   authMiddleware,
//   authorize("accounts.update"),
//   validateZod(updateAccountSchema, "body"),
//   checkUserIsActive,
//   auditMiddleware("update_account"),
//   updateAccount
// );
// router.get(
//   "/",
//   authMiddleware,
//   authorize("accounts.read"),
//   validateZod(GetAccountsDtoSchema, "query"),
//   checkUserIsActive,
//   auditMiddleware("get_all_accounts"),
//   getAccounts
// );
// router.delete(
//   "/:id",
//   authMiddleware,
//   authorize("accounts.delete"),
//   checkUserIsActive,
//   auditMiddleware("delete_account"),
//   deleteAccountById
// );

export default router;
