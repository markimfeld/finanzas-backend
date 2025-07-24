// import { FilterQuery } from "mongoose";
import { CreateAccountDto } from "../../dtos/createAccount.dto";
import { IAccount } from "../../models/account.model";

export interface IAccountRepository {
  create(userId: string, dto: CreateAccountDto): Promise<IAccount>;
  //   findById(accountId: string): Promise<IAccount | null>;
  //   findOne(options: FilterQuery<IAccount>): Promise<IAccount | null>;
  //   findAll(): Promise<IAccount[]>;
  //   findByFilters(dto: GetAccountsDto, userId: string): Promise<IAccount[]>;
  //   countByFilters(dto: GetAccountsDto, userId: string): Promise<number>;
  //   updateBudget(id: string, data: Partial<IAccount>): Promise<IAccount | null>;
  //   deleteBudgetById(accountId: string, userId: string): Promise<void>;
}

//   async create(data) {
//     return AccountModel.create(data);
//   }

//   async findByUser(userId: string) {
//     return AccountModel.find({ userId, isDeleted: false });
//   }

//   async findById(id: string) {
//     return AccountModel.findById(id);
//   }

//   async updateById(id: string, data) {
//     return AccountModel.findByIdAndUpdate(id, data, { new: true });
//   }

//   async softDeleteById(id: string) {
//     return AccountModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
//   }
