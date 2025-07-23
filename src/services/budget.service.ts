// dtos
import { CreateBudgetDto } from "../dtos/createBudget.dto";
import { GetBudgetsDto } from "../dtos/getBudgets.dto";
import { PaginatedResult } from "../dtos/paginatedResult.dto";
import { UpdateBudgetDto } from "../dtos/updateBudget.dto";
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

  async updateBudgetById(
    userId: string,
    budgetId: string,
    budgetData: UpdateBudgetDto
  ): Promise<IBudget> {
    if (!budgetData.category && budgetData.startDate && budgetData.endDate) {
      throw new BadRequestError(
        MESSAGES.VALIDATION.BUDGET.CATEGORY_MUST_BE_PROVIDED_WHEN_UPDATE_RANGE_DATE
      );
    }

    if (budgetData.category && !budgetData.startDate && !budgetData.endDate) {
      throw new BadRequestError(
        MESSAGES.VALIDATION.BUDGET.RANGE_DATE_MUST_BE_PROVIDED_WHEN_UPDATING_CATEGORY
      );
    }

    if (budgetData.category) {
      const category = await this.categoryRepository.findById(
        budgetData.category.toString()
      );

      if (!category) {
        throw new NotFoundError(MESSAGES.VALIDATION.CATEGORY.NOT_FOUND);
      }

      if (category?.userId.toString() !== userId) {
        throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
      }

      const { startDate, endDate } = budgetData;

      if (startDate && endDate) {
        if (new Date(startDate) >= new Date(endDate)) {
          throw new BadRequestError(
            MESSAGES.VALIDATION.BUDGET.START_DATE_MUST_BE_BEFORE_END_DATE
          );
        }

        const overlappingBudget = await this.budgetRepository.findOne({
          _id: { $ne: budgetId },
          category: budgetData.category,
          userId,
          $or: [
            {
              startDate: { $lte: budgetData.endDate },
              endDate: { $gte: budgetData.startDate },
            },
          ],
        });

        if (overlappingBudget) {
          throw new ConflictError(
            MESSAGES.VALIDATION.BUDGET.BUDGET_ALREADY_EXISTS
          );
        }
      }
    }

    const budgetUpdated = await this.budgetRepository.updateBudget(
      budgetId,
      budgetData
    );

    if (!budgetUpdated) {
      throw new NotFoundError(MESSAGES.ERROR.BUDGET.NOT_FOUNTD);
    }

    return budgetUpdated;
  }

  async deleteBudgetById(budgetId: string, userId: string): Promise<void> {
    // Podés hacer una verificación previa si querés
    const budget = await this.budgetRepository.findById(budgetId);

    if (!budget || budget.userId.toString() !== userId || budget.isDeleted) {
      throw new NotFoundError(MESSAGES.ERROR.BUDGET.NOT_FOUNTD);
    }

    await this.budgetRepository.deleteBudgetById(budgetId, userId);
  }
}
