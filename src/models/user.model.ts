import { Schema, model, Document } from 'mongoose';

/** DTO “plano” que usa todo tu dominio */
export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    refreshToken?: string;
    role: string
}

/** Documento que Mongoose guarda en la colección */
export type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        refreshToken: { type: String, default: null },
        role: {
            type: String,
            enum: ['admin', 'user', 'viewer'],
            default: 'user'
        }
    },
    { timestamps: true }     // createdAt / updatedAt
);

export const UserModel = model<UserDocument>('User', userSchema);
