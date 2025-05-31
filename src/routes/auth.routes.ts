import express from 'express';
import { login, refreshAccessToken } from '../controllers/auth.controller';
import { validateZod } from '../middlewares/validateZod';
import { loginSchema } from '../validations/auth.schema';

const router = express.Router();

router.post('/login', validateZod(loginSchema), login);
router.post('/refresh-token', refreshAccessToken);

export default router;
