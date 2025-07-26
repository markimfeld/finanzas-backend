import { MESSAGES } from "../constants/messages";
import { z } from "zod";

export const updateAccountSchema = z.object({
  name: z
    .string({ required_error: MESSAGES.VALIDATION.ACCOUNT.NAME_REQUIRED })
    .min(1, { message: MESSAGES.VALIDATION.ACCOUNT.NAME_REQUIRED })
    .optional(),
  type: z
    .enum(["bank", "cash", "digital_wallet", "credit_card", "other"])
    .optional(),
  balance: z
    .number({ required_error: MESSAGES.VALIDATION.ACCOUNT.BALANCE_REQUIRED })
    .min(0, { message: MESSAGES.VALIDATION.ACCOUNT.BALANCE_REQUIRED })
    .optional(),
});
