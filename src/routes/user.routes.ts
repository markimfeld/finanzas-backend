import express from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";
import { validateZod } from "../middlewares/validateZod";
import { createUserSchema } from "../validations/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", authMiddleware, authorize("users.read"), getAllUsers);
router.post("/", validateZod(createUserSchema), createUser);

export default router;
