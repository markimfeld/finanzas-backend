import { Schema, model, Document } from "mongoose";

export interface ITransaction {
  _id: string;
  userId: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  account: Schema.Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  description: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Documento que Mongoose guarda en la colección */
export type TransactionDocument = ITransaction & Document;

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const TransactionModel = model("Transaction", transactionSchema);
