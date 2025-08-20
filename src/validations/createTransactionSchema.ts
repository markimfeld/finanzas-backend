import { MESSAGES } from "../constants/messages";
import { z } from "zod";
import { objectIdValidator } from "./objectId.schema";

export const createTransactionSchema = z.object({
  account: objectIdValidator,
  category: objectIdValidator,
  type: z.enum(["income", "expense"]),
  amount: z
    .number({ required_error: MESSAGES.VALIDATION.TRANSACTION.AMOUNT_REQUIRED })
    .min(0, { message: MESSAGES.VALIDATION.TRANSACTION.AMOUNT_REQUIRED }),
  description: z.string(),
});
