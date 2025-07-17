import { Request, Response, NextFunction } from "express";
// services
import { budgetService } from "../services";
// errors
import { ForbiddenError } from "../errors";
// messages
import { MESSAGES } from "../constants/messages";
// dtos
import { CreateBudgetDto } from "../dtos/createBudget.dto";
import { GetBudgetsDto } from "../dtos/getBudgets.dto";

export const createBudget = async (
  req: Request<{}, {}, CreateBudgetDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    // validaciones de permisos
    if (!userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const newBudget = await budgetService.createBudget(userId, req.body);

    res.status(201).json({
      success: true,
      data: newBudget,
      message: MESSAGES.SUCCESS.BUDGET.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const dto = req.query as unknown as GetBudgetsDto;
    const userId = req.user?.userId;

    // validaciones de permisos
    if (!userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const result = await budgetService.getBudgets(dto, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
