import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { BadRequestError } from "../errors";

export const validateZod =
  (schema: ZodSchema<any>, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[source];
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new BadRequestError("Validation failed", errors);
    }

    // Guardar en un nuevo campo del request para no romper nada
    (req as any)[`validated${capitalize(source)}`] = result.data;

    next();
  };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
