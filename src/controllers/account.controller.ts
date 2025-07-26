import { Request, Response, NextFunction } from "express";
// dtos
import { CreateAccountDto } from "../dtos/createAccount.dto";
import { UpdateAccountDto } from "../dtos/updateAccount.dto";
import { AccountDTO } from "../dtos/account.dto";
// errors
import { ForbiddenError } from "../errors";
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
