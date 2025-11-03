/*
 * DTO de salida para evitar
 * exponer datos sensibles de USER
 */
import { Schema } from "mongoose";
import { IInvestmentTransaction } from "../models/investmentTransaction.model";

export class InvestmentTransactionDTO {
  id: string;
  userId: Schema.Types.ObjectId;
  investmentId: Schema.Types.ObjectId;
  operationDate: Date;
  type: "buy" | "sell" | "interest" | "maturity" | "initial";
  quantity: number;
  price: number;
  amount: number;
  cclAtTrade?: number;
  currency: "USD" | "ARS" | "USDT";
  isDeleted: Boolean;
  avgPrice: number;
  pnl: number;
  pnlPct: number;

  constructor(investmentTransaction: IInvestmentTransaction & { _id: any }) {
    this.id = investmentTransaction._id.toString(); // Aseguramos que sea string
    this.userId = investmentTransaction.userId;
    this.investmentId = investmentTransaction.investmentId;
    this.operationDate = investmentTransaction.operationDate;
    this.type = investmentTransaction.type;
    this.quantity = investmentTransaction.quantity;
    this.price = investmentTransaction.price;
    this.amount = investmentTransaction.amount;
    this.cclAtTrade = investmentTransaction.cclAtTrade;
    this.currency = investmentTransaction.currency;
    this.isDeleted = investmentTransaction.isDeleted;
    this.avgPrice = investmentTransaction.avgPrice;
    this.pnl = investmentTransaction.pnl;
    this.pnlPct = investmentTransaction.pnlPct;
  }

  static fromMany(
    investmentTransactions: (IInvestmentTransaction & { _id: any })[]
  ): InvestmentTransactionDTO[] {
    return investmentTransactions.map(
      (investmentTransaction) =>
        new InvestmentTransactionDTO(investmentTransaction)
    );
  }

  static from(
    investmentTransaction: IInvestmentTransaction & { _id: any }
  ): InvestmentTransactionDTO {
    return new InvestmentTransactionDTO(investmentTransaction);
  }
}
