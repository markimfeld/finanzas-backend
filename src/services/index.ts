import { UserService } from "./user.service";
import { UserRepositoryMongo } from "../repositories/implementations/mongodb/user.repository.mongo";
import { AuditLogMongoRepository } from "../repositories/implementations/mongodb/auditLog.repository";
import { AuditLogService } from "./auditLog.service";
import { BudgetRepositoryMongo } from "../repositories/implementations/mongodb/budget.repository.mongo";
import { BudgetService } from "./budget.service";
import { CategoryRepositoryMongo } from "../repositories/implementations/mongodb/category.repository.mongo";
import { CategoryService } from "./category.service";
import { AccountService } from "./account.service";
import { AccountRepositoryMongo } from "../repositories/implementations/mongodb/account.repository.mongo";

const userRepository = new UserRepositoryMongo();
export const userService = new UserService(userRepository);

const auditRepository = new AuditLogMongoRepository();
export const auditService = new AuditLogService(auditRepository);

const budgetRepository = new BudgetRepositoryMongo();
const categoryRepository = new CategoryRepositoryMongo();

export const budgetService = new BudgetService(
  budgetRepository,
  categoryRepository
);
export const categoryService = new CategoryService(categoryRepository);

const accountRepository = new AccountRepositoryMongo();
export const accountService = new AccountService(accountRepository);
