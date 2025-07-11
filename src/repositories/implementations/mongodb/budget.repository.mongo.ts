import { FilterQuery } from 'mongoose';
import { BudgetModel } from '../../../models/budget.model';
import { IBudgetRepository } from '../../../interfaces/repositories/budget.repository.interface';
import { CreateBudgetDto } from '../../../dtos/createBudget.dto';
import { IBudget } from '../../../models/budget.model';

export class BudgetRepositoryMongo implements IBudgetRepository {
    async create(user_id: string, dto: CreateBudgetDto): Promise<IBudget> {
        const budget = await BudgetModel.create({ ...dto, userId: user_id });
        const { _id, userId, amount, category, startDate, endDate, createdAt, updatedAt } = budget.toObject();
        return { _id, userId, amount, category, startDate, endDate, createdAt, updatedAt };
    }
    async findById(budgetId: string): Promise<IBudget | null> {
        return await BudgetModel.findById(budgetId).lean<IBudget>(); // Usás .lean() para devolver POJO
    }
    async findOne(options: FilterQuery<IBudget>): Promise<IBudget | null> {
        return await BudgetModel.findOne(options).lean<IBudget>();
    }
}
