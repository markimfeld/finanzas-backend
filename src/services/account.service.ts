import { IAccount } from "@/models/account.model";
import { CreateAccountDto } from "../dtos/createAccount.dto";
import { IAccountRepository } from "../interfaces/repositories/account.repository.interface";
import { UpdateAccountDto } from "../dtos/updateAccount.dto";
import { BadRequestError, NotFoundError } from "../errors";
import { MESSAGES } from "../constants/messages";
import { PaginatedResult } from "../dtos/paginatedResult.dto";

export class AccountService {
  constructor(private readonly accountRepo: IAccountRepository) {}

  async createAccount(dto: CreateAccountDto, userId: string) {
    return this.accountRepo.create(userId, dto);
  }

  async getAccountById(accountId: string): Promise<IAccount> {
    const account = await this.accountRepo.findById(accountId);

    if (!account) {
      throw new NotFoundError(MESSAGES.ERROR.ACCOUNT.NOT_FOUNTD);
    }

    return account;
  }

  async getAccounts(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IAccount>> {
    return this.accountRepo.findByUserPaginated(userId, page, limit);
  }

  async updateAccountById(
    accountId: string,
    accountData: UpdateAccountDto
  ): Promise<IAccount> {
    const updatedAccount = await this.accountRepo.updateAccountById(
      accountId,
      accountData
    );

    if (!updatedAccount) {
      throw new NotFoundError(MESSAGES.ERROR.ACCOUNT.NOT_FOUNTD);
    }

    return updatedAccount;
  }

  async softDeleteAccountById(accountId: string, userId: string) {
    // Podés hacer una verificación previa si querés
    const account = await this.accountRepo.findById(accountId);

    if (!account || account.userId.toString() !== userId || account.isDeleted) {
      throw new NotFoundError(MESSAGES.ERROR.ACCOUNT.NOT_FOUNTD);
    }

    if (account.balance > 0) {
      throw new BadRequestError(
        MESSAGES.ERROR.ACCOUNT.CANNOT_DELETE_ACCOUNT_WITH_BALANCE_GREATER_THAN_ZERO
      );
    }

    await this.accountRepo.softDeleteAccountById(accountId, userId);
  }
}
