import express from 'express';
import { createUser, getAllUsers } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', createUser);
router.get('/', authMiddleware, getAllUsers); // Ruta protegida

export default router;