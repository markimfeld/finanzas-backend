import { UpdateTransactionDto } from "@/dtos/updateTransaction.dto";
import { CreateTransactionDto } from "../../../dtos/createTransaction.dto";
import { ITransactionRepository } from "../../../interfaces/repositories/transaction.repository.interface";
import {
  ITransaction,
  TransactionModel,
} from "../../../models/transaction.model";
import { PaginatedResult } from "../../../dtos/paginatedResult.dto";

export class TransactionRepositoryMongo implements ITransactionRepository {
  async create(
    user_id: string,
    dto: CreateTransactionDto
  ): Promise<ITransaction> {
    const transaction = await TransactionModel.create({
      ...dto,
      userId: user_id,
    });
    const {
      _id,
      userId,
      category,
      account,
      amount,
      type,
      description,
      isDeleted,
      createdAt,
      updatedAt,
    } = transaction.toObject();
    return {
      _id,
      userId,
      category,
      account,
      amount,
      type,
      description,
      isDeleted,
      createdAt,
      updatedAt,
    };
  }

  async findById(transactionId: string): Promise<ITransaction | null> {
    return await TransactionModel.findById(transactionId).lean<ITransaction>(); // Usás .lean() para devolver POJO
  }

  async findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ITransaction>> {
    const skip = (page - 1) * limit;

    const [accounts, total] = await Promise.all([
      TransactionModel.find({ userId, isDeleted: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      TransactionModel.countDocuments({ userId, isDeleted: false }),
    ]);

    return {
      data: accounts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async updateTransactionById(
    id: string,
    data: UpdateTransactionDto
  ): Promise<ITransaction | null> {
    return await TransactionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softTransactionDeleteById(
    transactionId: string,
    userId: string
  ): Promise<void> {
    await TransactionModel.updateOne(
      { _id: transactionId, userId, isDeleted: false },
      { $set: { isDeleted: true } }
    );
  }
}
