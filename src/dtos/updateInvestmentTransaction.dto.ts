export interface UpdateInvestmentTransactionDto {
  investmentId?: string;
  operationDate?: Date;
  type?: "buy" | "sell" | "interest" | "maturity";
  quantity?: number;
  price?: number;
  amount?: number;
  currency?: "USD" | "ARS" | "USDT";
}
