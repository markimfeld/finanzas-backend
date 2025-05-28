import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { IUser } from '../interfaces/repositories/user.repository.interface';
import { BadRequestError, InternalServerError } from '../errors';
import { UserDTO } from '../dtos/user.dto';
import { ERROR_MESSAGES, VALIDATION_MESSAGES } from '../constants/messages';


export const createUser = async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction): Promise<void> => {
    try {

        const user = await userService.registerUser(req.body);

        if (user == null) {
            throw new InternalServerError(ERROR_MESSAGES.GENERAL.INTERNAL_SERVER);
        }
        res.status(201).json({ success: true, data: user, message: "Usuario creado correctamente." });
    } catch (error) {
        next(error) // pasa el error al middleware centralizado
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        const safeUsers = UserDTO.fromMany(users);

        res.status(200).json({ success: true, size: safeUsers.length, data: safeUsers });
    } catch (error) {
        next(error)
    }
};
