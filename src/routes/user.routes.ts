import express from "express";
import { activateUser, createUser, deactivateUser, getAllUsers, getUserById, updateProfile, updateUser } from "../controllers/user.controller";
import { validateZod } from "../middlewares/validateZod";
import { createUserSchema, updateUserSchema } from "../validations/user.schema";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { protectUserCreation } from "../middlewares/protectUserCreation";
import { checkUserIsActive } from "../middlewares/checkUserIsActive";
import { auditMiddleware } from "../middlewares/audit.middleware";
import { updateProfileSchema } from "../validations/updateProfile.schema";

const router = express.Router();

router.get("/", authMiddleware, authorize("users.read"), checkUserIsActive, auditMiddleware('get_all_user'), getAllUsers);
router.get("/:id", authMiddleware, authorize("users.read"), checkUserIsActive, auditMiddleware('get_user'), getUserById);
router.post("/", protectUserCreation, validateZod(createUserSchema), auditMiddleware('create_user'), createUser);
router.put("/:id", authMiddleware, authorize("users.update"), validateZod(updateUserSchema), checkUserIsActive, auditMiddleware('update_user'), updateUser);
router.patch('/:id/deactivate', authMiddleware, authorize("users.delete"), checkUserIsActive, auditMiddleware('deactivate_user'), deactivateUser);
router.patch('/:id/activate', authMiddleware, authorize("users.delete"), checkUserIsActive, auditMiddleware('activate_user'), activateUser);
router.put('/', authMiddleware, checkUserIsActive, validateZod(updateProfileSchema), auditMiddleware('update_profile_user'), updateProfile);

export default router;
