import { CreateAccountDto } from "../../../dtos/createAccount.dto";
import { AccountModel, IAccount } from "../../../models/account.model";
import { IAccountRepository } from "../../../interfaces/repositories/account.repository.interface";

export class AccountRepositoryMongo implements IAccountRepository {
  async create(user_id: string, dto: CreateAccountDto): Promise<IAccount> {
    const budget = await AccountModel.create({ ...dto, userId: user_id });
    const { _id, userId, name, type, balance, isDeleted } = budget.toObject();
    return {
      _id,
      userId,
      name,
      type,
      balance,
      isDeleted,
    };
  }
}
