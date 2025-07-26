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

  async findById(accountId: string): Promise<IAccount | null> {
    return await AccountModel.findById(accountId).lean<IAccount>(); // Usás .lean() para devolver POJO
  }

  async updateAccountById(
    id: string,
    data: Partial<IAccount>
  ): Promise<IAccount | null> {
    return await AccountModel.findByIdAndUpdate(id, data, { new: true });
  }
}
