import express from "express";
import {
    changePassword,
    login,
    logout,
    refreshAccessToken,
} from "../controllers/auth.controller";
import { validateZod } from "../middlewares/validateZod";
import { loginSchema } from "../validations/auth.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { changePasswordSchema } from "../validations/changePassword.schema";

const router = express.Router();

router.post("/login", validateZod(loginSchema), login);
router.post("/change-password", authMiddleware, validateZod(changePasswordSchema), changePassword)
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", refreshAccessToken);

export default router;
