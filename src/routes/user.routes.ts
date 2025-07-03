import express from "express";
import { activateUser, createUser, deactivateUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controller";
import { validateZod } from "../middlewares/validateZod";
import { createUserSchema, updateUserSchema } from "../validations/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { protectUserCreation } from "../middlewares/protectUserCreation";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";

const router = express.Router();

router.get("/", authMiddleware, authorize("users.read"), checkUserIsActive, getAllUsers);
router.get("/:id", authMiddleware, authorize("users.read"), checkUserIsActive, getUserById);
router.post("/", protectUserCreation, validateZod(createUserSchema), createUser);
router.put("/:id", authMiddleware, authorize("users.update"), validateZod(updateUserSchema), checkUserIsActive, updateUser);
router.patch('/:id/deactivate', authMiddleware, authorize("users.delete"), checkUserIsActive, deactivateUser);
router.patch('/:id/activate', authMiddleware, authorize("users.delete"), checkUserIsActive, activateUser);

export default router;
