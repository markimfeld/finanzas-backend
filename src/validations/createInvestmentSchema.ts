import { z } from "zod";

export const createInvestmentSchema = z.object({
  type: z.enum(["stock", "crypto", "caucion", "stablecoin", "etf"]),
  fxRateSource: z.enum(["MEP", "CCL", "Oficial"]).optional(),
  ratio: z.number().min(0).optional(),
  description: z.string().optional(),
  symbol: z.string().optional(),
});
