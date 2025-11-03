import { Router } from "express";
// middleware
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";
import { getPriceBySymbol } from "../controllers/price.controller";
import { validateZod } from "../middlewares/validateZod";
import { GetPriceMarketDtoSchema } from "../validations/GetPriceMarketDtoSchema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  validateZod(GetPriceMarketDtoSchema, "query"),
  checkUserIsActive,
  getPriceBySymbol
);

export default router;
