export interface CreateInvestmentDto {
  fxRateSource?: "MEP" | "CCL" | "Oficial";
  ratio?: number;
  symbol: string;
  type: "stock" | "crypto" | "caucion" | "stablecoin" | "etf" | "cedear";
  description?: string;
  totalQuantity?: number;
  avgPriceUnderlyingUSD?: number;
  avgPriceCedearUSD?: number;
  currentValue?: number;
  pnl?: number;
  pnlPct?: number;
}
