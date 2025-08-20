import { UpdateTransactionDto } from "@/dtos/updateTransaction.dto";
import { CreateTransactionDto } from "../../../dtos/createTransaction.dto";
import { ITransactionRepository } from "../../../interfaces/repositories/transaction.repository.interface";
import {
  ITransaction,
  TransactionModel,
} from "../../../models/transaction.model";

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

  async findById(
    userId: string,
    transactionId: string
  ): Promise<ITransaction | null> {
    return null;
  }

  async findAll(userId: string, filters?: any): Promise<ITransaction[]> {
    return [];
  }

  async updateTransactionById(
    id: string,
    data: UpdateTransactionDto
  ): Promise<ITransaction | null> {
    return null;
  }

  async delete(userId: string, id: string): Promise<void> {}

  //   async findById(accountId: string): Promise<IAccount | null> {
  //     return await AccountModel.findById(accountId).lean<IAccount>(); // Usás .lean() para devolver POJO
  //   }

  //   async findByUserPaginated(
  //     userId: string,
  //     page: number,
  //     limit: number
  //   ): Promise<PaginatedResult<IAccount>> {
  //     const skip = (page - 1) * limit;

  //     const [accounts, total] = await Promise.all([
  //       AccountModel.find({ userId, isDeleted: false })
  //         .skip(skip)
  //         .limit(limit)
  //         .sort({ createdAt: -1 }),
  //       AccountModel.countDocuments({ userId, isDeleted: false }),
  //     ]);

  //     return {
  //       data: accounts,
  //       pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  //     };
  //   }

  //   async updateAccountById(
  //     id: string,
  //     data: Partial<IAccount>
  //   ): Promise<IAccount | null> {
  //     return await AccountModel.findByIdAndUpdate(id, data, { new: true });
  //   }

  //   async softDeleteAccountById(id: string, userId: string): Promise<void> {
  //     await AccountModel.updateOne(
  //       { _id: id, userId: userId, isDeleted: false },
  //       { $set: { isDeleted: true } }
  //     );
  //   }
}
