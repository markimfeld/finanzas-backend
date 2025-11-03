import { Schema, model, Document } from "mongoose";

export interface IInvestment {
  _id: string;
  userId: Schema.Types.ObjectId;
  type: "stock" | "crypto" | "caucion" | "stablecoin" | "etf" | "cedear";
  symbol: string; // ticker o identificador (ej: AAPL, BTC, USDT)
  description?: string;
  ratio?: number;
  fxRateSource?: "MEP" | "CCL" | "Oficial";
  isDeleted: Boolean;
  // Datos cacheados
  totalQuantity: number;
  avgPriceUnderlyingUSD: number;
  avgPriceCedearUSD: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;

  createdAt: Date;
  updatedAt: Date;
}

/** Documento que Mongoose guarda en la colección */
export type InvestmentDocument = IInvestment & Document;

const investmentSchema = new Schema<InvestmentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["stock", "crypto", "caucion", "stablecoin", "etf", "cedear"],
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    // Configuración específica para CEDEARs
    ratio: { type: Number }, // opcional, solo si es type = 'cedear'
    fxRateSource: {
      type: String,
      enum: ["MEP", "CCL", "Oficial"],
      default: "CCL",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    totalQuantity: { type: Number, default: 0 },
    avgPriceUnderlyingUSD: { type: Number, default: 0 },
    avgPriceCedearUSD: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    pnl: { type: Number, default: 0 },
    pnlPct: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const InvestmentModel = model("Investment", investmentSchema);
