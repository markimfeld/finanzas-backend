import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { IUser } from '../interfaces/repositories/user.repository.interface';
import { BadRequestError, InternalServerError } from '../errors';


export const createUser = async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { name, email } = req.body;
        if (!name || !email) {
            throw new BadRequestError('Nombre y email son requeridos');
        }

        const user = await userService.registerUser(req.body);

        if (user == null) {
            throw new InternalServerError('No se creó el usuario.')
        }
        res.status(201).json({ success: true, data: user, message: "Usuario creado correctamente." });
    } catch (error) {
        next(error) // pasa el error al middleware centralizado
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, size: users.length, data: users });
    } catch (error) {
        next(error)
    }
};
