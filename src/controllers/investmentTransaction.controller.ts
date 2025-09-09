import { Request, Response, NextFunction } from "express";
// dtos
import { CreateInvestmentTransactionDto } from "../dtos/createInvestmentTransaction.dto";
// errors
import { BadRequestError, ForbiddenError } from "../errors";
// messages
import { MESSAGES } from "../constants/messages";
// services
import { investmentTransactionService } from "../services";
import { UpdateInvestmentTransactionDto } from "../dtos/updateInvestmentTransaction.dto";
import { InvestmentTransactionDTO } from "../dtos/investmentTransaction.dto";

export const createInvestmentTransaction = async (
  req: Request<{}, {}, CreateInvestmentTransactionDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    // validaciones de permisos
    if (!userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const newInvestmentTransaction =
      await investmentTransactionService.createInvestmentTransaction(
        req.body,
        userId
      );

    res.status(201).json({
      success: true,
      data: newInvestmentTransaction,
      message: MESSAGES.SUCCESS.INVESTMENT_TRANSACTION.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

export const updateInvestmentTransaction = async (
  req: Request<{ id: string }, {}, UpdateInvestmentTransactionDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const investmentTransactionIdUpdate = req.params.id;
    const authenticatedUser = req.user!; // ya está validado por authMiddleware

    const investmentTransaction =
      await investmentTransactionService.getInvestmentTransactionById(
        investmentTransactionIdUpdate
      );
    // verifico que el budget que quiero modificar sea del usuario logueado
    if (investmentTransaction.userId?.toString() !== authenticatedUser.userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const updatedInvestmentTransaction =
      await investmentTransactionService.updateInvestmentTransactionById(
        investmentTransactionIdUpdate,
        req.body
      );
    const safeInvestmentTransaction = InvestmentTransactionDTO.from(
      updatedInvestmentTransaction
    );

    res.status(200).json({
      success: true,
      data: safeInvestmentTransaction,
      message: MESSAGES.SUCCESS.INVESTMENT_TRANSACTION.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

export const getInvestmentTransactions = async (
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

    const result = await investmentTransactionService.getInvestmentTransactions(
      userId,
      page,
      limit
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteInvestmentTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id: investmentTransactionId } = req.params;

    if (!userId) {
      throw new BadRequestError(
        MESSAGES.ERROR.AUTHORIZATION.USER_NOT_AUTHENTICATED
      );
    }

    await investmentTransactionService.softDeleteInvestmentTransactionById(
      investmentTransactionId,
      userId
    );

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.INVESTMENT_TRANSACTION.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
