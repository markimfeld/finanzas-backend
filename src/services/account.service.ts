import { CreateAccountDto } from "../dtos/createAccount.dto";
import { IAccountRepository } from "../interfaces/repositories/account.repository.interface";

export class AccountService {
  constructor(private readonly accountRepo: IAccountRepository) {}

  async createAccount(dto: CreateAccountDto, userId: string) {
    return this.accountRepo.create(userId, dto);
  }
}
