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
import { TransactionRepositoryMongo } from "../repositories/implementations/mongodb/transaction.repository.mongo";
import { TransactionService } from "./transaction.service";
import { InvestmentRepositoryMongo } from "../repositories/implementations/mongodb/investment.repository.mongo";
import { InvestmentService } from "./investment.service";
import { InvestmentTransactionRepositoryMongo } from "../repositories/implementations/mongodb/investmentTransaction.repository.mongo";
import { InvestmentTransactionService } from "./investmentTransaction.service";
import { PriceRepository } from "../repositories/implementations/mongodb/price.repository";
import { PriceService } from "./price.service";

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

const transactionRepository = new TransactionRepositoryMongo();
export const transactionService = new TransactionService(transactionRepository);

const investmentTransactionRepository =
  new InvestmentTransactionRepositoryMongo();
const investmentRepository = new InvestmentRepositoryMongo();
export const priceRepository = new PriceRepository();

export const investmentService = new InvestmentService(
  investmentRepository,
  investmentTransactionRepository,
  priceRepository
);

export const investmentTransactionService = new InvestmentTransactionService(
  investmentTransactionRepository,
  investmentService
);

export const priceService = new PriceService(priceRepository);
