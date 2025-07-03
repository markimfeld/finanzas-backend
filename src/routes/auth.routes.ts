import express from "express";
import {
    changePassword,
    forgotPassword,
    login,
    logout,
    refreshAccessToken,
    resendVerificationEmail,
    resetPassword,
    verifyEmail,
} from "../controllers/auth.controller";
import { validateZod } from "../middlewares/validateZod";
import { loginSchema } from "../validations/auth.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { changePasswordSchema } from "../validations/changePassword.schema";
import { resetPasswordSchema } from "../validations/resetPassword.schema";
import { ResendVerificationEmailSchema } from "../dtos/resendVerificationEmail.dto";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";

const router = express.Router();

router.post("/login", validateZod(loginSchema), login);
router.post("/change-password", authMiddleware, validateZod(changePasswordSchema), checkUserIsActive, changePassword)
router.post("/logout", authMiddleware, checkUserIsActive, logout);
router.post("/refresh-token", authMiddleware, checkUserIsActive, refreshAccessToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', validateZod(ResendVerificationEmailSchema), resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', validateZod(resetPasswordSchema), resetPassword);

export default router;  
