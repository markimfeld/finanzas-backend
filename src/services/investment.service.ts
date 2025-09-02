import { NotFoundError } from "../errors";
import { MESSAGES } from "../constants/messages";
import { CreateInvestmentDto } from "../dtos/createInvestment.dto";
import { IInvestmentRepository } from "../interfaces/repositories/investment.repository.interface";
import { IInvestment } from "../models/investment.model";
import { PaginatedResult } from "../dtos/paginatedResult.dto";
import { UpdateInvestmentDto } from "../dtos/updateInvestment.dto";

export class InvestmentService {
  constructor(private readonly investmentRepository: IInvestmentRepository) {}

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
