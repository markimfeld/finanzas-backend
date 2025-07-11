import { Schema, model, Document } from 'mongoose';

export interface ICategory {
    _id: string;
    name: string;
    userId: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/** Documento que Mongoose guarda en la colección */
export type CategoryDocument = ICategory & Document;

const categorySchema = new Schema<CategoryDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export const CategoryModel = model<CategoryDocument>('Category', categorySchema);
