import express from "express";
import {
    changePassword,
    login,
    logout,
    refreshAccessToken,
    verifyEmail,
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
router.get('/verify-email/:token', verifyEmail);

export default router;  
