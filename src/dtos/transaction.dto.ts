/*
 * DTO de salida para evitar
 * exponer datos sensibles de USER
 */
import { Schema } from "mongoose";
import { ITransaction } from "../models/transaction.model";

export class TransactionDTO {
  id: string;
  category: Schema.Types.ObjectId;
  account: Schema.Types.ObjectId;
  type: string;
  amount: number;
  userId: Schema.Types.ObjectId;
  description: string;

  constructor(transaction: ITransaction & { _id: any }) {
    this.id = transaction._id.toString(); // Aseguramos que sea string
    this.userId = transaction.userId;
    this.category = transaction.category;
    this.account = transaction.account;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.description = transaction.description;
  }

  static fromMany(
    transactions: (ITransaction & { _id: any })[]
  ): TransactionDTO[] {
    return transactions.map((transaction) => new TransactionDTO(transaction));
  }

  static from(transaction: ITransaction & { _id: any }): TransactionDTO {
    return new TransactionDTO(transaction);
  }
}
