import { FilterQuery } from "mongoose";
import { CreateBudgetDto } from "../../dtos/createBudget.dto";
import { IBudget } from "../../models/budget.model";
import { GetBudgetsDto } from "../../dtos/getBudgets.dto";

export interface IBudgetRepository {
  create(userId: string, dto: CreateBudgetDto): Promise<IBudget>;
  findById(budgetId: string): Promise<IBudget | null>;
  findOne(options: FilterQuery<IBudget>): Promise<IBudget | null>;
  findAll(): Promise<IBudget[]>;
  findByFilters(dto: GetBudgetsDto, userId: string): Promise<IBudget[]>;
  countByFilters(dto: GetBudgetsDto, userId: string): Promise<number>;
  updateBudget(id: string, data: Partial<IBudget>): Promise<IBudget | null>;
}
