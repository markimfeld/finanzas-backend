import { z } from "zod";
import { objectIdValidator } from "./objectId.schema";

export const updateInvestmentTransactionSchema = z.object({
  investmentId: objectIdValidator.optional(),
  type: z.enum(["buy", "sell", "interest", "maturity"]).optional(),
  currency: z.enum(["USD", "ARS", "USDT"]).optional(),
  operationDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  quantity: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  amount: z.number().min(0).optional(),
});
