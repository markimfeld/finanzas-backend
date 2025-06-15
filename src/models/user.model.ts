import { Schema, model, Document } from 'mongoose';
import { IUserRole } from '../interfaces/common/roles.interface';

/** DTO “plano” que usa todo tu dominio */
export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    refreshToken?: string;
    role: IUserRole;
    emailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationTokenExpires?: Date
}

/** Documento que Mongoose guarda en la colección */
export type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        emailVerified: { type: Boolean, default: false },
        emailVerificationToken: { type: String },
        emailVerificationTokenExpires: { type: Date },
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
