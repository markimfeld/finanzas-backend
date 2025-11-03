import { UpdateInvestmentTransactionDto } from "../../../dtos/updateInvestmentTransaction.dto";
import { CreateInvestmentTransactionDto } from "../../../dtos/createInvestmentTransaction.dto";
import { IInvestmentTransactionRepository } from "../../../interfaces/repositories/investmentTransaction.repository.interface";
import {
  IInvestmentTransaction,
  InvestmentTransactionModel,
} from "../../../models/investmentTransaction.model";
import { PaginatedResult } from "../../../dtos/paginatedResult.dto";

export class InvestmentTransactionRepositoryMongo
  implements IInvestmentTransactionRepository
{
  async create(
    user_id: string,
    dto: CreateInvestmentTransactionDto
  ): Promise<IInvestmentTransaction> {
    const investmentTransaction = await InvestmentTransactionModel.create({
      ...dto,
      userId: user_id,
    });
    const {
      _id,
      userId,
      investmentId,
      operationDate,
      type,
      quantity,
      price,
      amount,
      currency,
      isDeleted,
      createdAt,
      updatedAt,
    } = investmentTransaction.toObject();

    return {
      _id,
      userId,
      investmentId,
      operationDate,
      type,
      quantity,
      price,
      amount,
      currency,
      isDeleted,
      createdAt,
      updatedAt,
    };
  }

  async findById(
    investmentTransactionId: string
  ): Promise<IInvestmentTransaction | null> {
    return await InvestmentTransactionModel.findById(
      investmentTransactionId
    ).lean<IInvestmentTransaction>(); // Usás .lean() para devolver POJO
  }

  async findByInvestment(
    investmentId: string
  ): Promise<IInvestmentTransaction[]> {
    return await InvestmentTransactionModel.find({
      investmentId: investmentId,
    });
  }

  async findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IInvestmentTransaction>> {
    const skip = (page - 1) * limit;

    const [investmentTransactions, total] = await Promise.all([
      InvestmentTransactionModel.find({ userId, isDeleted: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      InvestmentTransactionModel.countDocuments({ userId, isDeleted: false }),
    ]);

    return {
      data: investmentTransactions,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async updateInvestmentTransactionById(
    id: string,
    data: UpdateInvestmentTransactionDto
  ): Promise<IInvestmentTransaction | null> {
    return await InvestmentTransactionModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async softInvestmentTransactionDeleteById(
    investmentTransactionId: string,
    userId: string
  ): Promise<void> {
    await InvestmentTransactionModel.updateOne(
      { _id: investmentTransactionId, userId, isDeleted: false },
      { $set: { isDeleted: true } }
    );
  }
}
