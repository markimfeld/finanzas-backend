export interface UpdateInvestmentTransactionDto {
  investmentId?: string;
  operationDate?: Date;
  type?: "buy" | "sell" | "interest" | "maturity" | "initial";
  quantity?: number;
  price?: number;
  amount?: number;
  cclAtTrade?: number;
  currency?: "USD" | "ARS" | "USDT";
}
