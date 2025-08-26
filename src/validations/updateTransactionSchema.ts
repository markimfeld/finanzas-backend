import { MESSAGES } from "../constants/messages";
import { z } from "zod";
import { objectIdValidator } from "./objectId.schema";

export const updateTransactionSchema = z.object({
  account: objectIdValidator.optional(),
  category: objectIdValidator.optional(),
  type: z.enum(["income", "expense"]).optional(),
  amount: z
    .number({ required_error: MESSAGES.VALIDATION.TRANSACTION.AMOUNT_REQUIRED })
    .min(0, { message: MESSAGES.VALIDATION.TRANSACTION.AMOUNT_REQUIRED })
    .optional(),
  description: z.string().optional(),
});
