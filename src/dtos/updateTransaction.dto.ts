export interface UpdateTransactionDto {
  account?: string;
  category?: string;
  amount?: number;
  type?: "income" | "expense";
  description?: string;
}
