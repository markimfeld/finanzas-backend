// dtos
import { CreateBudgetDto } from "../dtos/createBudget.dto";
import { GetBudgetsDto } from "../dtos/getBudgets.dto";
import { PaginatedResult } from "../dtos/paginatedResult.dto";
// model
import { IBudget } from "../models/budget.model";
// interfaces
import { IBudgetRepository } from "../interfaces/repositories/budget.repository.interface";
import { ICategoryRepository } from "../interfaces/repositories/category.repository.interface";
// errors
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../errors";
// messages
import { MESSAGES } from "../constants/messages";

export class BudgetService {
  constructor(
    private budgetRepository: IBudgetRepository,
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async createBudget(userId: string, dto: CreateBudgetDto): Promise<IBudget> {
    const category = await this.categoryRepository.findById(dto.category);
    if (!category) {
      throw new NotFoundError(MESSAGES.VALIDATION.CATEGORY.NOT_FOUND);
    }

    if (category.userId.toString() !== userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const { startDate, endDate } = dto;

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestError(
        MESSAGES.VALIDATION.BUDGET.START_DATE_MUST_BE_BEFORE_END_DATE
      );
    }

    const overlappingBudget = await this.budgetRepository.findOne({
      category: dto.category,
      userId,
      $or: [
        {
          startDate: { $lte: dto.endDate },
          endDate: { $gte: dto.startDate },
        },
      ],
    });

    if (overlappingBudget) {
      throw new ConflictError(MESSAGES.VALIDATION.BUDGET.BUDGET_ALREADY_EXISTS);
    }

    return await this.budgetRepository.create(userId, dto);
  }

  async getBudgets(
    dto: GetBudgetsDto,
    userId: string
  ): Promise<PaginatedResult<IBudget>> {
    const [data, total] = await Promise.all([
      this.budgetRepository.findByFilters(dto, userId),
      this.budgetRepository.countByFilters(dto, userId),
    ]);

    return {
      data,
      pagination: {
        total,
        page: dto.page,
        limit: dto.limit,
        pages: Math.ceil(total / dto.limit),
      },
    };
  }

  async getBudgetById(budgetId: string): Promise<IBudget> {
    const budget = await this.budgetRepository.findById(budgetId);

    if (!budget) {
      throw new NotFoundError(MESSAGES.ERROR.BUDGET.NOT_FOUNTD);
    }

    return budget;
  }
}
