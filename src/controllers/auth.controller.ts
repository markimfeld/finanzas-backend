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
import { UnauthorizedError } from "../errors";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.loginUser(email, password);

        const refreshToken = generateRefreshToken({ userId: user._id });
        await userService.updateRefreshToken(user._id, refreshToken);

        user.refreshToken = refreshToken;

        res.status(200).json({
            success: true,
            data: AuthResponseDTO.from(user, token),
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
        ) as { userId: string };

        const user = await userService.getUserById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedError(
                MESSAGES.ERROR.AUTH.REFRESH_TOKEN_INVALID
            );
        }

        const newAccessToken = generateAccessToken({ userId: user._id });

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
        ) as { userId: string };

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
