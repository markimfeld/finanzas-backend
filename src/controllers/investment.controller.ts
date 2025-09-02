import { Request, Response, NextFunction } from "express";
// dtos
import { CreateInvestmentDto } from "../dtos/createInvestment.dto";
// errors
import { BadRequestError, ForbiddenError } from "../errors";
// messages
import { MESSAGES } from "../constants/messages";
// services
import { investmentService } from "../services";
import { UpdateInvestmentDto } from "../dtos/updateInvestment.dto";
import { InvestmentDTO } from "../dtos/investment.dto";

export const createInvestment = async (
  req: Request<{}, {}, CreateInvestmentDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    // validaciones de permisos
    if (!userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const newInvestment = await investmentService.createInvestment(
      req.body,
      userId
    );

    res.status(201).json({
      success: true,
      data: newInvestment,
      message: MESSAGES.SUCCESS.INVESTMENT.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvestment = async (
  req: Request<{ id: string }, {}, UpdateInvestmentDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const investmentIdUpdate = req.params.id;
    const authenticatedUser = req.user!; // ya está validado por authMiddleware

    const investment =
      await investmentService.getInvestmentById(investmentIdUpdate);
    // verifico que el budget que quiero modificar sea del usuario logueado
    if (investment.userId?.toString() !== authenticatedUser.userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const updatedInvestment = await investmentService.updateInvestmentById(
      investmentIdUpdate,
      req.body
    );
    const safeInvestment = InvestmentDTO.from(updatedInvestment);

    res.status(200).json({
      success: true,
      data: safeInvestment,
      message: MESSAGES.SUCCESS.INVESTMENT.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

export const getInvestments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const page = parseInt(req.query.page as string) || 1;

    const limit = parseInt(req.query.limit as string) || 10;

    const result = await investmentService.getInvestments(userId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteInvestmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id: investmentId } = req.params;

    if (!userId) {
      throw new BadRequestError(
        MESSAGES.ERROR.AUTHORIZATION.USER_NOT_AUTHENTICATED
      );
    }

    await investmentService.softDeleteInvestmentById(investmentId, userId);

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.INVESTMENT.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
