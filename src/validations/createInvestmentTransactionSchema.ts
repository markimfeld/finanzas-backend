import { z } from "zod";
import { objectIdValidator } from "./objectId.schema";

export const createInvestmentTransactionSchema = z.object({
  investmentId: objectIdValidator,
  type: z.enum(["buy", "sell", "interest", "maturity", "initial"]),
  currency: z.enum(["USD", "ARS", "USDT"]).optional(),
  operationDate: z.string().transform((str) => new Date(str)),
  quantity: z.number().min(0),
  price: z.number().min(0).optional(),
  amount: z.number().min(0),
  cclAtTrade: z.number().min(0).optional(),
  avgPrice: z.number().min(0).optional(),
  pnl: z.number().min(0).optional(),
  pnlPct: z.number().min(0).optional(),
});
