import { Request, Response, NextFunction } from "express";
// dtos
import { CreateAccountDto } from "../dtos/createAccount.dto";
// errors
import { ForbiddenError } from "../errors";
// messages
import { MESSAGES } from "../constants/messages";
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
