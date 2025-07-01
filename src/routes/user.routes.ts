import express from "express";
import { createUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controller";
import { validateZod } from "../middlewares/validateZod";
import { createUserSchema, updateUserSchema } from "../validations/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { protectUserCreation } from "../middlewares/protectUserCreation";

const router = express.Router();

router.get("/", authMiddleware, authorize("users.read"), getAllUsers);
router.get("/:id", authMiddleware, authorize("users.read"), getUserById);
router.post("/", protectUserCreation, validateZod(createUserSchema), createUser);
router.put("/:id", authMiddleware, authorize("users.update"), validateZod(updateUserSchema), updateUser);

export default router;
