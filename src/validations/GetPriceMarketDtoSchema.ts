import { symbol, z } from "zod";

export const GetPriceMarketDtoSchema = z.object({
  symbol: z.string().optional(),
});
