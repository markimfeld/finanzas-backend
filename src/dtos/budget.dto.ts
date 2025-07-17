/*
* DTO de salida para evitar
* exponer datos sensibles de USER
*/
import { Schema } from 'mongoose';
import { IBudget } from '../models/budget.model';

export class BudgetDTO {
    id: string;
    userId: Schema.Types.ObjectId;
    category: Schema.Types.ObjectId;
    amount: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;


    constructor(budget: IBudget & { _id: any }) {
        this.id = budget._id.toString(); // Aseguramos que sea string
        this.userId = budget.userId;
        this.category = budget.category;
        this.amount = budget.amount;
        this.startDate = budget.startDate;
        this.endDate = budget.endDate;
        this.createdAt = budget.createdAt;
        this.updatedAt = budget.updatedAt;
    }

    static fromMany(budgets: (IBudget & { _id: any })[]): BudgetDTO[] {
        return budgets.map(budget => new BudgetDTO(budget));
    }

    static from(budget: IBudget & { _id: any }): BudgetDTO {
        return new BudgetDTO(budget);
    }
}
