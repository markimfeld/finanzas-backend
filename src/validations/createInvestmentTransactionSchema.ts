import { z } from "zod";
import { objectIdValidator } from "./objectId.schema";

export const createInvestmentTransactionSchema = z.object({
  investmentId: objectIdValidator,
  type: z.enum(["buy", "sell", "interest", "maturity"]),
  currency: z.enum(["USD", "ARS", "USDT"]),
  operationDate: z.string().transform((str) => new Date(str)),
  quantity: z.number().min(0),
  price: z.number().min(0),
  amount: z.number().min(0),
});
