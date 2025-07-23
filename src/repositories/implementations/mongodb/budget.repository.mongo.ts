import { FilterQuery } from "mongoose";
import { BudgetModel } from "../../../models/budget.model";
import { IBudgetRepository } from "../../../interfaces/repositories/budget.repository.interface";
import { CreateBudgetDto } from "../../../dtos/createBudget.dto";
import { IBudget } from "../../../models/budget.model";
import { GetBudgetsDto } from "../../../dtos/getBudgets.dto";

export class BudgetRepositoryMongo implements IBudgetRepository {
  async create(user_id: string, dto: CreateBudgetDto): Promise<IBudget> {
    const budget = await BudgetModel.create({ ...dto, userId: user_id });
    const {
      _id,
      userId,
      amount,
      category,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      isDeleted,
    } = budget.toObject();
    return {
      _id,
      userId,
      amount,
      category,
      startDate,
      endDate,
      createdAt,
      updatedAt,
      isDeleted,
    };
  }
  async findById(budgetId: string): Promise<IBudget | null> {
    return await BudgetModel.findById(budgetId).lean<IBudget>(); // Usás .lean() para devolver POJO
  }
  async findOne(options: FilterQuery<IBudget>): Promise<IBudget | null> {
    return await BudgetModel.findOne(options).lean<IBudget>();
  }

  async findAll(): Promise<IBudget[]> {
    return await BudgetModel.find().lean<IBudget[]>();
  }
  async findByFilters(dto: GetBudgetsDto, userId: string) {
    const { page, limit, category, startDate, endDate } = dto;
    const skip = (page - 1) * limit;

    const filters: any = { userId };

    if (category) filters.category = category;
    if (startDate || endDate) {
      filters.$and = [];
      if (startDate) filters.$and.push({ endDate: { $gte: startDate } });
      if (endDate) filters.$and.push({ startDate: { $lte: endDate } });
    }

    return BudgetModel.find(filters)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);
  }

  async countByFilters(dto: GetBudgetsDto, userId: string) {
    const { category, startDate, endDate } = dto;
    const filters: any = { userId };

    if (category) filters.category = category;
    if (startDate || endDate) {
      filters.$and = [];
      if (startDate) filters.$and.push({ endDate: { $gte: startDate } });
      if (endDate) filters.$and.push({ startDate: { $lte: endDate } });
    }

    return BudgetModel.countDocuments(filters);
  }

  async updateBudget(
    id: string,
    data: Partial<IBudget>
  ): Promise<IBudget | null> {
    return await BudgetModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBudgetById(budgetId: string, userId: string): Promise<void> {
    await BudgetModel.updateOne(
      { _id: budgetId, userId, isDeleted: false },
      { $set: { isDeleted: true } }
    );
  }
}
