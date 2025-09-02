export interface CreateInvestmentDto {
  fxRateSource?: "MEP" | "CCL" | "Oficial";
  ratio?: number;
  symbol: string;
  type: "stock" | "crypto" | "caucion" | "stablecoin" | "etf";
  description?: string;
}
