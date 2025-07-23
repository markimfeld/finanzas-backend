import { objectIdValidator } from "./objectId.schema";
import { MESSAGES } from "../constants/messages";
import { z } from "zod";

export const updateBudgetSchema = z.object({
  category: objectIdValidator.optional(),
  amount: z
    .number({ required_error: MESSAGES.VALIDATION.BUDGET.AMOUNT_REQUIRED })
    .positive({ message: MESSAGES.VALIDATION.BUDGET.AMOUNT_MUST_BE_POSITIVE })
    .optional(),
  startDate: z
    .string({ required_error: MESSAGES.VALIDATION.BUDGET.START_DATE_REQUIRED })
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string({ required_error: MESSAGES.VALIDATION.BUDGET.START_END_REQUIRED })
    .transform((str) => new Date(str))
    .optional(),
});
