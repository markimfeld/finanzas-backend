import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { AuthResponseDTO } from '../dtos/auth.dto';
import { MESSAGES } from '../constants/messages';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.loginUser(email, password);
        res.status(200).json({ success: true, data: AuthResponseDTO.from(user, token), message: MESSAGES.SUCCESS.USER.LOGGED_IN });
    } catch (err) {
        next(err);
    }
};
