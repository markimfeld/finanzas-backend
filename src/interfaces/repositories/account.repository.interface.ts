// import { FilterQuery } from "mongoose";
import { PaginatedResult } from "../../dtos/paginatedResult.dto";
import { CreateAccountDto } from "../../dtos/createAccount.dto";
import { IAccount } from "../../models/account.model";

export interface IAccountRepository {
  create(userId: string, dto: CreateAccountDto): Promise<IAccount>;
  findById(accountId: string): Promise<IAccount | null>;
  findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IAccount>>;
  updateAccountById(
    id: string,
    data: Partial<IAccount>
  ): Promise<IAccount | null>;
  softDeleteAccountById(id: string, userId: string): Promise<void>;
}
