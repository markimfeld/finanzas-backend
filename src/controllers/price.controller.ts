import { Request, Response, NextFunction } from "express";

// errors
import { ForbiddenError } from "../errors";
// messages
import { MESSAGES } from "../constants/messages";
// services
import { priceService } from "../services";

export const getPriceBySymbol = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
    }

    const symbol = req.query.symbol;
    console.log(String(symbol));

    const result = await priceService.getSymbolPrice(String(symbol));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
