import { NotFoundError } from "../errors";
import { MESSAGES } from "../constants/messages";
import { CreateTransactionDto } from "../dtos/createTransaction.dto";
import { ITransactionRepository } from "../interfaces/repositories/transaction.repository.interface";
import { ITransaction } from "../models/transaction.model";
import { PaginatedResult } from "../dtos/paginatedResult.dto";
import { UpdateTransactionDto } from "../dtos/updateTransaction.dto";

export class TransactionService {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async createTransaction(dto: CreateTransactionDto, userId: string) {
    return this.transactionRepository.create(userId, dto);
  }

  async getTransactionById(transactionId: string): Promise<ITransaction> {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (!transaction) {
      throw new NotFoundError(MESSAGES.ERROR.TRANSACTION.NOT_FOUND);
    }

    return transaction;
  }

  async getTransactions(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ITransaction>> {
    return this.transactionRepository.findByUserPaginated(userId, page, limit);
  }

  async updateTransactionById(
    transactionId: string,
    transactionData: UpdateTransactionDto
  ): Promise<ITransaction> {
    const updatedTransaction =
      await this.transactionRepository.updateTransactionById(
        transactionId,
        transactionData
      );

    if (!updatedTransaction) {
      throw new NotFoundError(MESSAGES.ERROR.TRANSACTION.NOT_FOUND);
    }

    return updatedTransaction;
  }

  async softDeleteTransactionById(transactionId: string, userId: string) {
    const transaction =
      await this.transactionRepository.findById(transactionId);

    if (
      !transaction ||
      transaction.userId.toString() !== userId ||
      transaction.isDeleted
    ) {
      throw new NotFoundError(MESSAGES.ERROR.TRANSACTION.NOT_FOUND);
    }

    await this.transactionRepository.softTransactionDeleteById(
      transactionId,
      userId
    );
  }
}
