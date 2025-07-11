import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

// routes
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import budgetRoutes from './routes/budget.routes';
import categoryRoutes from './routes/category.routes';

// middleware
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/notFound.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Logging HTTP requests
app.use(morgan('dev')); // También podés usar 'combined' o 'tiny'

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);

// Manejo de rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);

export default app;
