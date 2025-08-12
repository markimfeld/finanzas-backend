import { CreateAccountDto } from "../../../dtos/createAccount.dto";
import { AccountModel, IAccount } from "../../../models/account.model";
import { IAccountRepository } from "../../../interfaces/repositories/account.repository.interface";
import { PaginatedResult } from "../../../dtos/paginatedResult.dto";

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

  async findByUserPaginated(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IAccount>> {
    const skip = (page - 1) * limit;

    const [accounts, total] = await Promise.all([
      AccountModel.find({ userId, isDeleted: false })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      AccountModel.countDocuments({ userId, isDeleted: false }),
    ]);

    return {
      data: accounts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async updateAccountById(
    id: string,
    data: Partial<IAccount>
  ): Promise<IAccount | null> {
    return await AccountModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteAccountById(id: string, userId: string): Promise<void> {
    await AccountModel.updateOne(
      { _id: id, userId: userId, isDeleted: false },
      { $set: { isDeleted: true } }
    );
  }
}
