import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { AuthResponseDTO } from '../dtos/auth.dto';
import { MESSAGES } from '../constants/messages';
import { generateRefreshToken, generateAccessToken } from '../utils/token.util';
import { UnauthorizedError } from '../errors';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.loginUser(email, password);

        const refreshToken = generateRefreshToken({ userId: user._id });
        await userService.updateRefreshToken(user._id, refreshToken);

        res.status(200).json({ success: true, data: AuthResponseDTO.from(user, token), message: MESSAGES.SUCCESS.USER.LOGGED_IN });
    } catch (err) {
        next(err);
    }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) throw new UnauthorizedError(MESSAGES.ERROR.AUTH.REFRESH_TOKEN_MISSING);

        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { userId: string };

        const user = await userService.getUserById(payload.userId);

        if (!user || user.refreshToken !== refreshToken) {
            throw new UnauthorizedError(MESSAGES.ERROR.AUTH.REFRESH_TOKEN_INVALID);
        }

        const newAccessToken = generateAccessToken({ userId: user._id });

        res.json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.sendStatus(204);

        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { userId: string };

        await userService.removeRefreshToken(payload.userId);

        res.status(200).json({ success: true, message: 'Logout exitoso' });
    } catch (error) {
        next(error);
    }
};