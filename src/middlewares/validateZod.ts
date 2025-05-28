import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { BadRequestError } from '../errors';

export const validateZod = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new BadRequestError('Validation failed', errors);
  }

  // Si la validación fue exitosa, opcionalmente podés guardar los datos limpios en req.body:
  req.body = result.data;

  next();
};
