import { ITransaction } from "../../models/transaction.model";
import { CreateTransactionDto } from "../../dtos/createTransaction.dto";
import { UpdateTransactionDto } from "../../dtos/updateTransaction.dto";
import { PaginatedResult } from "../../dtos/paginatedResult.dto";

export interface ITransactionRepository {
  create(userId: string, dto: CreateTransactionDto): Promise<ITransaction>;
  findById(transactionId: string): Promise<ITransaction | null>;
  findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ITransaction>>;
  updateTransactionById(
    id: string,
    data: UpdateTransactionDto
  ): Promise<ITransaction | null>;
  softTransactionDeleteById(
    transactionId: string,
    userId: string
  ): Promise<void>;
}
