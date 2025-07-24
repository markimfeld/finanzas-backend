import { Schema, model, Document } from "mongoose";

export interface IAccount {
  _id: string;
  name: string;
  type: string;
  balance: number;
  userId: Schema.Types.ObjectId;
  isDeleted: boolean;
}

/** Documento que Mongoose guarda en la colección */
export type AccountDocument = IAccount & Document;

const accountSchema = new Schema<AccountDocument>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["bank", "cash", "digital_wallet", "credit_card", "other"],
      required: true,
    },
    balance: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AccountModel = model("Account", accountSchema);
