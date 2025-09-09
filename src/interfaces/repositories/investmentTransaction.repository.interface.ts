import { IInvestmentTransaction } from "../../models/investmentTransaction.model";
import { CreateInvestmentTransactionDto } from "../../dtos/createInvestmentTransaction.dto";
import { UpdateInvestmentTransactionDto } from "../../dtos/updateInvestmentTransaction.dto";
import { PaginatedResult } from "../../dtos/paginatedResult.dto";

export interface IInvestmentTransactionRepository {
  create(
    userId: string,
    dto: CreateInvestmentTransactionDto
  ): Promise<IInvestmentTransaction>;
  findById(
    investmentTransactionId: string
  ): Promise<IInvestmentTransaction | null>;
  findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IInvestmentTransaction>>;
  updateInvestmentTransactionById(
    id: string,
    data: UpdateInvestmentTransactionDto
  ): Promise<IInvestmentTransaction | null>;
  softInvestmentTransactionDeleteById(
    investmentTransactionId: string,
    userId: string
  ): Promise<void>;
}
