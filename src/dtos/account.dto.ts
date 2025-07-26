/*
 * DTO de salida para evitar
 * exponer datos sensibles de USER
 */
import { Schema } from "mongoose";
import { IAccount } from "../models/account.model";

export class AccountDTO {
  id: string;
  name: string;
  type: string;
  balance: number;
  userId: Schema.Types.ObjectId;

  constructor(account: IAccount & { _id: any }) {
    this.id = account._id.toString(); // Aseguramos que sea string
    this.userId = account.userId;
    this.name = account.name;
    this.type = account.type;
    this.balance = account.balance;
  }

  static fromMany(accounts: (IAccount & { _id: any })[]): AccountDTO[] {
    return accounts.map((account) => new AccountDTO(account));
  }

  static from(account: IAccount & { _id: any }): AccountDTO {
    return new AccountDTO(account);
  }
}
