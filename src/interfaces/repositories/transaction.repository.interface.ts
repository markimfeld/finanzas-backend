import { ITransaction } from "../../models/transaction.model";
import { CreateTransactionDto } from "../../dtos/createTransaction.dto";
import { UpdateTransactionDto } from "../../dtos/updateTransaction.dto";

export interface ITransactionRepository {
  create(userId: string, dto: CreateTransactionDto): Promise<ITransaction>;
  findById(userId: string, transactionId: string): Promise<ITransaction | null>;
  findAll(userId: string, filters?: any): Promise<ITransaction[]>;
  updateTransactionById(
    id: string,
    data: UpdateTransactionDto
  ): Promise<ITransaction | null>;
  delete(userId: string, id: string): Promise<void>;
}
