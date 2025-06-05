import express from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";
import { validateZod } from "../middlewares/validateZod";
import { createUserSchema } from "../validations/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { protectUserCreation } from "../middlewares/protectUserCreation";

const router = express.Router();

router.get("/", authMiddleware, authorize("users.read"), getAllUsers);
router.post("/", protectUserCreation, validateZod(createUserSchema), createUser);

export default router;
