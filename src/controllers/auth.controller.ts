import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
