import { NotFoundError } from "../errors";
import { MESSAGES } from "../constants/messages";
import { CreateInvestmentTransactionDto } from "../dtos/createInvestmentTransaction.dto";
import { IInvestmentTransactionRepository } from "../interfaces/repositories/investmentTransaction.repository.interface";
import { IInvestmentTransaction } from "../models/investmentTransaction.model";
import { PaginatedResult } from "../dtos/paginatedResult.dto";
import { UpdateInvestmentTransactionDto } from "../dtos/updateInvestmentTransaction.dto";
import { InvestmentService } from "./investment.service";

export class InvestmentTransactionService {
  constructor(
    private readonly investmentTransactionRepository: IInvestmentTransactionRepository,
    private readonly investmentService: InvestmentService
  ) {}

  async createInvestmentTransaction(
    dto: CreateInvestmentTransactionDto,
    userId: string
  ) {
    const tx = await this.investmentTransactionRepository.create(userId, dto);
    await this.investmentService.recalculateInvestment(dto.investmentId);
    return tx;
  }

  async getInvestmentTransactionById(
    investmentTransactionId: string
  ): Promise<IInvestmentTransaction> {
    const investmentTransaction =
      await this.investmentTransactionRepository.findById(
        investmentTransactionId
      );

    if (!investmentTransaction) {
      throw new NotFoundError(MESSAGES.ERROR.INVESTMENT_TRANSACTION.NOT_FOUND);
    }

    return investmentTransaction;
  }

  async getInvestmentTransactions(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IInvestmentTransaction>> {
    return this.investmentTransactionRepository.findByUserPaginated(
      userId,
      page,
      limit
    );
  }

  async updateInvestmentTransactionById(
    investmentTransactionId: string,
    investmentTransactionData: UpdateInvestmentTransactionDto
  ): Promise<IInvestmentTransaction> {
    const updatedInvestmentTransaction =
      await this.investmentTransactionRepository.updateInvestmentTransactionById(
        investmentTransactionId,
        investmentTransactionData
      );

    if (!updatedInvestmentTransaction) {
      throw new NotFoundError(MESSAGES.ERROR.INVESTMENT_TRANSACTION.NOT_FOUND);
    }

    return updatedInvestmentTransaction;
  }

  async softDeleteInvestmentTransactionById(
    investmentTransactionId: string,
    userId: string
  ) {
    const investmentTransaction =
      await this.investmentTransactionRepository.findById(
        investmentTransactionId
      );

    if (
      !investmentTransaction ||
      investmentTransaction.userId.toString() !== userId ||
      investmentTransaction.isDeleted
    ) {
      throw new NotFoundError(MESSAGES.ERROR.INVESTMENT_TRANSACTION.NOT_FOUND);
    }

    await this.investmentTransactionRepository.softInvestmentTransactionDeleteById(
      investmentTransactionId,
      userId
    );
  }
}
