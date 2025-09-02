import { UpdateInvestmentDto } from "../../../dtos/updateInvestment.dto";
import { CreateInvestmentDto } from "../../../dtos/createInvestment.dto";
import { IInvestmentRepository } from "../../../interfaces/repositories/investment.repository.interface";
import { IInvestment, InvestmentModel } from "../../../models/investment.model";
import { PaginatedResult } from "../../../dtos/paginatedResult.dto";

export class InvestmentRepositoryMongo implements IInvestmentRepository {
  async create(
    user_id: string,
    dto: CreateInvestmentDto
  ): Promise<IInvestment> {
    const investment = await InvestmentModel.create({
      ...dto,
      userId: user_id,
    });
    const {
      _id,
      userId,
      type,
      description,
      fxRateSource,
      ratio,
      symbol,
      isDeleted,
      createdAt,
      updatedAt,
    } = investment.toObject();

    return {
      _id,
      userId,
      type,
      description,
      fxRateSource,
      ratio,
      symbol,
      isDeleted,
      createdAt,
      updatedAt,
    };
  }

  async findById(investmentId: string): Promise<IInvestment | null> {
    return await InvestmentModel.findById(investmentId).lean<IInvestment>(); // Usás .lean() para devolver POJO
  }

  async findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IInvestment>> {
    const skip = (page - 1) * limit;

    const [accounts, total] = await Promise.all([
      InvestmentModel.find({ userId, isDeleted: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      InvestmentModel.countDocuments({ userId, isDeleted: false }),
    ]);

    return {
      data: accounts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async updateInvestmentById(
    id: string,
    data: UpdateInvestmentDto
  ): Promise<IInvestment | null> {
    return await InvestmentModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softInvestmentDeleteById(
    investmentId: string,
    userId: string
  ): Promise<void> {
    await InvestmentModel.updateOne(
      { _id: investmentId, userId, isDeleted: false },
      { $set: { isDeleted: true } }
    );
  }
}
