/*
 * DTO de salida para evitar
 * exponer datos sensibles de USER
 */
import { Schema } from "mongoose";
import { IInvestment } from "../models/investment.model";

export class InvestmentDTO {
  id: string;
  type: string;
  symbol: string;
  ratio?: number;
  fxRateSource?: string;
  userId: Schema.Types.ObjectId;
  description?: string;
  isDeleted: Boolean;
  totalQuantity: number;
  avgPriceUnderlyingUSD?: number;
  avgPriceCedearUSD?: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;

  constructor(investment: IInvestment & { _id: any }) {
    this.id = investment._id.toString(); // Aseguramos que sea string
    this.userId = investment.userId;
    this.type = investment.type;
    this.description = investment.description;
    this.symbol = investment.symbol;
    this.ratio = investment.ratio;
    this.fxRateSource = investment.fxRateSource;
    this.isDeleted = investment.isDeleted;
    this.totalQuantity = investment.totalQuantity;
    this.avgPriceUnderlyingUSD = investment.avgPriceUnderlyingUSD;
    this.avgPriceCedearUSD = investment.avgPriceCedearUSD;
    this.currentValue = investment.currentValue;
    this.pnl = investment.pnl;
    this.pnlPct = investment.pnlPct;
  }

  static fromMany(
    investments: (IInvestment & { _id: any })[]
  ): InvestmentDTO[] {
    return investments.map((investment) => new InvestmentDTO(investment));
  }

  static from(investment: IInvestment & { _id: any }): InvestmentDTO {
    return new InvestmentDTO(investment);
  }
}
