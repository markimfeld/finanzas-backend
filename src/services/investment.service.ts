import { NotFoundError } from "../errors";
import { MESSAGES } from "../constants/messages";
import { CreateInvestmentDto } from "../dtos/createInvestment.dto";
import { IInvestmentRepository } from "../interfaces/repositories/investment.repository.interface";
import { IInvestment } from "../models/investment.model";
import { PaginatedResult } from "../dtos/paginatedResult.dto";
import { UpdateInvestmentDto } from "../dtos/updateInvestment.dto";
import { IInvestmentTransactionRepository } from "../interfaces/repositories/investmentTransaction.repository.interface";
import { IPriceRepository } from "../interfaces/repositories/price.repository.interface";

export class InvestmentService {
  constructor(
    private readonly investmentRepository: IInvestmentRepository,
    private readonly transactionRepository: IInvestmentTransactionRepository,
    private readonly priceRepository: IPriceRepository
  ) {}

  async createInvestment(dto: CreateInvestmentDto, userId: string) {
    return this.investmentRepository.create(userId, dto);
  }

  async getInvestmentById(investmentId: string): Promise<IInvestment> {
    const investment = await this.investmentRepository.findById(investmentId);

    if (!investment) {
      throw new NotFoundError(MESSAGES.ERROR.INVESTMENT.NOT_FOUND);
    }

    return investment;
  }

  async getInvestments(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IInvestment>> {
    return this.investmentRepository.findByUserPaginated(userId, page, limit);
  }

  async recalculateInvestment(investmentId: string) {
    const investment = await this.investmentRepository.findById(investmentId);
    if (!investment) {
      throw new NotFoundError(MESSAGES.ERROR.INVESTMENT.NOT_FOUND);
    }

    const transactions =
      await this.transactionRepository.findByInvestment(investmentId);

    if (transactions.length === 0) {
      return this.investmentRepository.updateInvestmentById(investmentId, {
        totalQuantity: 0,
        avgPriceUnderlyingUSD: 0,
        avgPriceCedearUSD: 0,
        currentValue: 0,
        pnl: 0,
        pnlPct: 0,
      });
    }

    // Precio que devuelve el repo (puede ser subyacente o CEDEAR según el symbol)
    const marketPriceUSD = await this.priceRepository.getPriceBySymbol(
      investment.symbol
    );
    console.log(marketPriceUSD);

    // totalQuantity representa la cantidad en la unidad del activo (CEDEARs / shares / coins)
    let totalQuantity = 0;
    // totalCostUSD = suma de (USD por unidad * cantidad de unidades)
    let totalCostUSD = 0;

    // acumuladores para 'initial' (pueden venir múltiples initial; los combinamos por peso)
    let initialCedears = 0;
    let initialCostUSD = 0;
    let currentValueFromBroker: number | null = null;
    let pnlFromBroker: number | null = null;
    let pnlPctFromBroker: number | null = null;

    let hasRealTransactions = false;

    for (const tx of transactions) {
      if (tx.type === "initial") {
        // tx.avgPrice: USD por unidad del activo (para CEDEAR el broker te da USD por CEDEAR)
        totalQuantity += tx.quantity;
        initialCedears += tx.quantity;
        initialCostUSD += (tx.avgPrice ?? 0) * tx.quantity;
        totalCostUSD += (tx.avgPrice ?? 0) * tx.quantity;

        // snapshot del broker (amount, pnl, pnlPct) — los respetamos si no hay reales
        currentValueFromBroker = tx.amount ?? currentValueFromBroker;
        pnlFromBroker = tx.pnl ?? pnlFromBroker;
        pnlPctFromBroker = tx.pnlPct ?? pnlPctFromBroker;
        continue;
      }

      // cualquier buy/sell real marca que hay transacciones reales
      if (tx.type === "buy" || tx.type === "sell") {
        hasRealTransactions = true;
      }

      // BUY
      if (tx.type === "buy") {
        if (investment.type === "cedear") {
          // tx.price en ARS, tx.cclAtTrade -> USD por CEDEAR
          const costUSD_per_cedear = Number(tx.price) / Number(tx.cclAtTrade);
          totalQuantity += tx.quantity; // cantidad en CEDEARs
          totalCostUSD += costUSD_per_cedear * tx.quantity;
        } else if (
          investment.type === "stock" ||
          investment.type === "crypto"
        ) {
          totalQuantity += tx.quantity; // cantidad en shares / coins
          totalCostUSD += (tx.price ?? 0) * tx.quantity; // price ya en USD
        }
      }

      // SELL
      if (tx.type === "sell") {
        if (investment.type === "cedear") {
          const costUSD_per_cedear = Number(tx.price) / Number(tx.cclAtTrade);
          totalQuantity -= tx.quantity;
          totalCostUSD -= costUSD_per_cedear * tx.quantity;
        } else if (
          investment.type === "stock" ||
          investment.type === "crypto"
        ) {
          totalQuantity -= tx.quantity;
          totalCostUSD -= (tx.price ?? 0) * tx.quantity;
        }
      }
    }

    // avgPriceCedearUSD y avgPriceUnderlyingUSD
    let avgPriceCedearUSD = 0;
    let avgPriceUnderlyingUSD = 0;

    if (investment.type === "cedear") {
      // si sólo hubo initial y no transacciones reales, usamos el snapshot calculado
      if (!hasRealTransactions && initialCedears > 0) {
        avgPriceCedearUSD = initialCostUSD / initialCedears;
        avgPriceUnderlyingUSD = 0; // no tenemos base histórica para underlying
      } else {
        // si hubo transacciones reales, calculamos dinámicamente
        avgPriceCedearUSD =
          totalQuantity > 0 ? totalCostUSD / totalQuantity : 0;
        avgPriceUnderlyingUSD =
          Number(investment.ratio) > 0
            ? avgPriceCedearUSD * Number(investment.ratio)
            : 0;
      }
    } else {
      // stock / crypto
      avgPriceCedearUSD = 0;
      avgPriceUnderlyingUSD =
        totalQuantity > 0 ? totalCostUSD / totalQuantity : 0;
    }

    // calcular currentValue:
    // Para CEDEAR: necesitamos precio por CEDEAR. Detectamos si marketPriceUSD es CEDEAR o subyacente.
    let currentValue = 0;
    if (!hasRealTransactions && currentValueFromBroker != null) {
      // sólo snapshot -> respetamos el amount que vino del broker
      currentValue = currentValueFromBroker;
    } else {
      if (investment.type === "cedear") {
        // si symbol termina en .BA asumimos que marketPriceUSD es precio del CEDEAR
        let marketPricePerCedear =
          typeof marketPriceUSD === "number" &&
          investment.symbol?.toUpperCase?.().endsWith?.(".BA")
            ? Number(marketPriceUSD)
            : // si no, asumimos marketPriceUSD es del subyacente -> lo convertible por ratio
              Number(marketPriceUSD) / Number(investment.ratio);

        if (!isFinite(marketPricePerCedear)) marketPricePerCedear = 0;
        currentValue = totalQuantity * marketPricePerCedear;
      } else {
        // stock / crypto -> marketPriceUSD es por unidad
        currentValue = totalQuantity * Number(marketPriceUSD);
      }
    }

    // pnl / pnlPct
    let pnl = 0;
    let pnlPct = 0;
    if (!hasRealTransactions && pnlFromBroker != null) {
      pnl = pnlFromBroker;
      pnlPct = pnlPctFromBroker ?? 0;
    } else {
      pnl = currentValue - totalCostUSD;
      pnlPct = totalCostUSD > 0 ? (pnl / totalCostUSD) * 100 : 0;
    }

    return this.investmentRepository.updateInvestmentById(investmentId, {
      totalQuantity,
      avgPriceUnderlyingUSD: Math.round(avgPriceUnderlyingUSD * 100) / 100,
      avgPriceCedearUSD: Math.round(avgPriceCedearUSD * 100) / 100,
      currentValue: Math.round(currentValue * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
      pnlPct: Math.round(pnlPct * 100) / 100,
    });
  }

  async updateInvestmentById(
    investmentId: string,
    investmentData: UpdateInvestmentDto
  ): Promise<IInvestment> {
    const updatedInvestment =
      await this.investmentRepository.updateInvestmentById(
        investmentId,
        investmentData
      );

    if (!updatedInvestment) {
      throw new NotFoundError(MESSAGES.ERROR.INVESTMENT.NOT_FOUND);
    }

    return updatedInvestment;
  }

  async softDeleteInvestmentById(investmentId: string, userId: string) {
    const investment = await this.investmentRepository.findById(investmentId);

    if (
      !investment ||
      investment.userId.toString() !== userId ||
      investment.isDeleted
    ) {
      throw new NotFoundError(MESSAGES.ERROR.INVESTMENT.NOT_FOUND);
    }

    await this.investmentRepository.softInvestmentDeleteById(
      investmentId,
      userId
    );
  }
}
