import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// services
import { userService } from "../services";
// dto
import { AuthResponseDTO } from "../dtos/auth.dto";
// messages
import { MESSAGES } from "../constants/messages";
// utils
import { generateRefreshToken, generateAccessToken } from "../utils/token.util";
// errors
import { BadRequestError, UnauthorizedError } from "../errors";
// interfaces
import { JwtPayload } from "../interfaces/auth/jwtPayload.interface";
import { IUserRole } from "../interfaces/common/roles.interface";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const { user, access_token } = await userService.loginUser(email, password);

        const refreshToken = generateRefreshToken({ userId: user._id, role: user.role as IUserRole });
        await userService.updateRefreshToken(user._id, refreshToken);

        user.refreshToken = refreshToken;

        res.status(200).json({
            success: true,
            data: AuthResponseDTO.from(user, access_token),
            message: MESSAGES.SUCCESS.USER.LOGGED_IN,
        });
    } catch (err) {
        next(err);
    }
};

export const refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken)
            throw new UnauthorizedError(
                MESSAGES.ERROR.AUTH.REFRESH_TOKEN_MISSING
            );

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as JwtPayload;

        const user = await userService.getUserById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedError(
                MESSAGES.ERROR.AUTH.REFRESH_TOKEN_INVALID
            );
        }

        const newAccessToken = generateAccessToken({ userId: user._id, role: user.role as IUserRole });

        res.json({
            success: true,
            data: AuthResponseDTO.from(user, newAccessToken),
            message: MESSAGES.SUCCESS.USER.TOKEN_REFRESHED,
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) res.sendStatus(204);

        const payload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as JwtPayload;

        const user = await userService.getUserById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedError(MESSAGES.ERROR.AUTH.ALREADY_LOGGED_OUT);
        }

        await userService.removeRefreshToken(payload.userId);

        res.status(200).json({
            success: true,
            message: MESSAGES.SUCCESS.USER.LOGGED_OUT,
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.userId!;

        await userService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({ success: true, message: MESSAGES.SUCCESS.AUTH.PASSWORD_UPDATED });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token;

        if (!token || typeof token !== 'string') {
            throw new BadRequestError(MESSAGES.ERROR.AUTH.INVALID_VERIFICATION_TOKEN);
        }

        const user = await userService.verifyEmailToken(token);

        if (!user) {
            throw new BadRequestError(MESSAGES.ERROR.AUTH.INVALID_VERIFICATION_TOKEN);
        }

        res.status(200).json({ success: true, message: MESSAGES.SUCCESS.AUTH.EMAIL_VERIFIED });
    } catch (error) {
        next(error);
    }
};

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        await userService.resendVerificationEmail(email);

        res.status(200).json({
            message: MESSAGES.SUCCESS.AUTH.VERIFICATION_EMAIL_RESENT
        });
    } catch (error) {
        next(error);
    }
};