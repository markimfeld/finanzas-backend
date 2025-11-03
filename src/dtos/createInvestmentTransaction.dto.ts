export interface CreateInvestmentTransactionDto {
  investmentId: string;
  operationDate: Date;
  type: "buy" | "sell" | "interest" | "maturity" | "initial";
  quantity: number;
  price: number;
  amount: number;
  cclAtTrade?: number;
  pnl?: number;
  pnlPct?: number;
  currency: "USD" | "ARS" | "USDT";
}
