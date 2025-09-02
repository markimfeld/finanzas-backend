import { IInvestment } from "../../models/investment.model";
import { CreateInvestmentDto } from "../../dtos/createInvestment.dto";
import { UpdateInvestmentDto } from "../../dtos/updateInvestment.dto";
import { PaginatedResult } from "../../dtos/paginatedResult.dto";

export interface IInvestmentRepository {
  create(userId: string, dto: CreateInvestmentDto): Promise<IInvestment>;
  findById(investmentId: string): Promise<IInvestment | null>;
  findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IInvestment>>;
  updateInvestmentById(
    id: string,
    data: UpdateInvestmentDto
  ): Promise<IInvestment | null>;
  softInvestmentDeleteById(investmentId: string, userId: string): Promise<void>;
}
