import { FilterQuery } from 'mongoose';
import { CreateBudgetDto } from '../../dtos/createBudget.dto';
import { IBudget } from '../../models/budget.model';

export interface IBudgetRepository {
    create(userId: string, dto: CreateBudgetDto): Promise<IBudget>;
    findById(budgetId: string): Promise<IBudget | null>;
    findOne(options: FilterQuery<IBudget>): Promise<IBudget | null>;
}
