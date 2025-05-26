import express from "express";
import { createUser, getAllUsers } from "../controllers/user.controller";
import { validateZod } from "../middlewares/validateZod";
import { createUserSchema } from "../validations/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", validateZod(createUserSchema), createUser);
router.get("/", authMiddleware, getAllUsers); // Ruta protegida

export default router;
