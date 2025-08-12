import { Request, Response, NextFunction } from "express";
// dtos
import { CreateAccountDto } from "../dtos/createAccount.dto";
import { UpdateAccountDto } from "../dtos/updateAccount.dto";
import { AccountDTO } from "../dtos/account.dto";
// errors
import { BadRequestError, ForbiddenError } from "../errors";
// messages
import { MESSAGES } from "../constants/messages";
// services
import { accountService } from "../services";

export const createAccount = async (
  req: Request<{}, {}, CreateAccountDto>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    // validaciones de permisos
    if (!userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const newAccount = await accountService.createAccount(req.body, userId);

    res.status(201).json({
      success: true,
      data: newAccount,
      message: MESSAGES.SUCCESS.ACCOUNT.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (
  req: Request<{ id: string }, {}, UpdateAccountDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accountIdToUpdate = req.params.id;
    const authenticatedUser = req.user!; // ya está validado por authMiddleware

    const account = await accountService.getAccountById(accountIdToUpdate);
    // verifico que el budget que quiero modificar sea del usuario logueado
    if (account.userId?.toString() !== authenticatedUser.userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const updatedAccount = await accountService.updateAccountById(
      accountIdToUpdate,
      req.body
    );
    const safeAccount = AccountDTO.from(updatedAccount);

    res.status(200).json({
      success: true,
      data: safeAccount,
      message: MESSAGES.SUCCESS.ACCOUNT.UPDATED,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccounts = async (
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

    const result = await accountService.getAccounts(userId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAccountById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id: accountId } = req.params;

    if (!userId) {
      throw new BadRequestError(
        MESSAGES.ERROR.AUTHORIZATION.USER_NOT_AUTHENTICATED
      );
    }

    await accountService.softDeleteAccountById(accountId, userId);

    res.status(200).json({
      success: true,
      message: MESSAGES.SUCCESS.ACCOUNT.DELETED,
    });
  } catch (error) {
    next(error);
  }
};
