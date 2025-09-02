import { z } from "zod";

export const updateInvestmentSchema = z.object({
  type: z.enum(["stock", "crypto", "caucion", "stablecoin", "etf"]).optional(),
  fxRateSource: z.enum(["MEP", "CCL", "Oficial"]).optional(),
  ratio: z.number().min(0).optional(),
  description: z.string().optional(),
  symbol: z.string().optional(),
});
