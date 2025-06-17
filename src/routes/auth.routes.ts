import express from "express";
import {
    changePassword,
    login,
    logout,
    refreshAccessToken,
    resendVerificationEmail,
    verifyEmail,
} from "../controllers/auth.controller";
import { validateZod } from "../middlewares/validateZod";
import { loginSchema } from "../validations/auth.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { changePasswordSchema } from "../validations/changePassword.schema";
import { ResendVerificationEmailSchema } from "../dtos/resendVerificationEmail.dto";

const router = express.Router();

router.post("/login", validateZod(loginSchema), login);
router.post("/change-password", authMiddleware, validateZod(changePasswordSchema), changePassword)
router.post("/logout", authMiddleware, logout);
router.post("/refresh-token", refreshAccessToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', validateZod(ResendVerificationEmailSchema), resendVerificationEmail);

export default router;  
