import { Request, Response, NextFunction } from "express";
// services
import { userService } from "../services";
// dtos
import { UserDTO } from "../dtos/user.dto";
import { CreateUserDto } from "../dtos/createUser.dto";
import { UpdateUserDto } from "../dtos/updateUser.dto";
// messages
import { MESSAGES } from "../constants/messages";
// erros
import { ForbiddenError, InternalServerError } from "../errors";
import { USER_ROLES } from "../interfaces/common/roles.interface";


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

export const updateUser = async (
    req: Request<{ id: string }, {}, UpdateUserDto>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {

        const userIdToUpdate = req.params.id;
        const authenticatedUser = req.user!; // ya está validado por authMiddleware

        const isAdmin = authenticatedUser.role === USER_ROLES.ADMIN;
        const isSelfUpdate = authenticatedUser.userId === userIdToUpdate;

        // Si no es admin y quiere modificar a otro → error
        if (!isAdmin && !isSelfUpdate) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
        }

        // Solo el admin puede modificar el campo role
        if (!isAdmin && req.body.role) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.CANNOT_CHANGE_ROLE);
        }

        const updatedUser = await userService.updateUser(userIdToUpdate, req.body);
        const safeUser = UserDTO.from(updatedUser);

        res.status(200).json({
            success: true,
            data: safeUser,
            message: MESSAGES.SUCCESS.USER.UPDATED,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const requestedId = req.params.id;
        const authenticatedUser = req.user!;

        const isAdmin = authenticatedUser.role === USER_ROLES.ADMIN;
        const isSelf = authenticatedUser.userId === requestedId;

        if (!isAdmin && !isSelf) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
        }

        const user = await userService.getUserById(requestedId);
        const safeUser = UserDTO.from(user);

        res.status(200).json({
            success: true,
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const user = req.user!;

        if (user.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
        }

        const updatedUser = await userService.deactivateUser(id);
        const safeUser = UserDTO.from(updatedUser);

        res.status(200).json({
            success: true,
            data: safeUser,
            message: MESSAGES.SUCCESS.USER.DEACTIVATED,
        });
    } catch (err) {
        next(err);
    }
};

export const activateUser = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const authenticatedUser = req.user!;

        if (authenticatedUser.role !== USER_ROLES.ADMIN) {
            throw new ForbiddenError(MESSAGES.ERROR.AUTHORIZATION.FORBIDDEN);
        }

        const user = await userService.activateUser(id);
        const safeUser = UserDTO.from(user);

        res.status(200).json({
            success: true,
            data: safeUser,
            message: MESSAGES.SUCCESS.USER.ACTIVATED,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId!;
        const updatedUser = await userService.updateUserProfile(userId, req.body);
        const safeUser = UserDTO.from(updatedUser);

        res.status(200).json({
            success: true,
            data: safeUser,
            message: MESSAGES.SUCCESS.USER.UPDATED
        })
    } catch (error) {
        next(error);
    }
};