import { Schema, model, Document } from "mongoose";

export interface IInvestmentTransaction {
  _id: string;
  userId: Schema.Types.ObjectId;
  investmentId: Schema.Types.ObjectId;
  operationDate: Date;
  type: "buy" | "sell" | "interest" | "maturity";
  quantity: number; // cantidad de CEDEARs, acciones, criptos, etc.
  price: number; // precio por unidad en la moneda original (ej: $12.000 ARS por CEDEAR)
  amount: number; // quantity * price
  currency: "USD" | "ARS" | "USDT";
  isDeleted: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Documento que Mongoose guarda en la colección */
export type InvestmentTransactionDocument = IInvestmentTransaction & Document;

const investmentTransactionSchema = new Schema<InvestmentTransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investmentId: {
      type: Schema.Types.ObjectId,
      ref: "Investment",
      required: true,
    },
    operationDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["buy", "sell", "interest", "maturity"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "ARS", "USDT"],
      default: "ARS",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const InvestmentTransactionModel = model(
  "InvestmentTransaction",
  investmentTransactionSchema
);
