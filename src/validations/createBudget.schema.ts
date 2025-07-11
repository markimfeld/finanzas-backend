
import { objectIdValidator } from "./objectId.schema";
import { MESSAGES } from "../constants/messages";
import { z } from "zod";



export const createBudgetSchema = z.object({
    category: objectIdValidator,
    amount: z
        .number({ required_error: MESSAGES.VALIDATION.BUDGET.AMOUNT_REQUIRED })
        .positive({ message: MESSAGES.VALIDATION.BUDGET.AMOUNT_MUST_BE_POSITIVE }),
    startDate: z
        .string({ required_error: MESSAGES.VALIDATION.BUDGET.START_DATE_REQUIRED })
        .transform((str) => new Date(str)),
    endDate: z
        .string({ required_error: MESSAGES.VALIDATION.BUDGET.START_END_REQUIRED })
        .transform((str) => new Date(str)),
});