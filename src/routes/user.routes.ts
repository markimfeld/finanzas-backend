import express from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";
import { validateZod } from "../middlewares/validateZod";
import { createUserSchema } from "../validations/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { USER_ROLES } from "../interfaces/common/roles.interface";

const router = express.Router();

router.post("/", authMiddleware, authorize(USER_ROLES.USER), validateZod(createUserSchema), createUser);
router.get("/", authMiddleware, authorize(USER_ROLES.ADMIN), getAllUsers);

export default router;
