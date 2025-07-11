import { Schema, model, Document } from 'mongoose';

export interface IBudget {
    _id: string;
    userId: Schema.Types.ObjectId;
    category: Schema.Types.ObjectId;
    amount: number;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

/** Documento que Mongoose guarda en la colección */
export type BudgetDocument = IBudget & Document;

const budgetSchema = new Schema<BudgetDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export const BudgetModel = model('Budget', budgetSchema);
