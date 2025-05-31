import { Request, Response, NextFunction } from "express";
// services
import { userService } from "../services";
// dtos
import { UserDTO } from "../dtos/user.dto";
import { CreateUserDto } from "../dtos/createUser.dto";
// messages
import { MESSAGES } from "../constants/messages";
// erros
import { InternalServerError } from "../errors";

export const createUser = async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await userService.registerUser(req.body);

        if (user == null) {
            throw new InternalServerError(
                MESSAGES.ERROR.GENERAL.INTERNAL_SERVER
            );
        }

        // DTO
        const safeUser = UserDTO.from(user);

        res.status(201).json({
            success: true,
            data: safeUser,
            message: MESSAGES.SUCCESS.USER.CREATED,
        });
    } catch (error) {
        next(error); // pasa el error al middleware centralizado
    }
};

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await userService.getAllUsers();

        // DTO
        const safeUsers = UserDTO.fromMany(users);

        res.status(200).json({
            success: true,
            size: safeUsers.length,
            data: safeUsers,
        });
    } catch (error) {
        next(error);
    }
};
