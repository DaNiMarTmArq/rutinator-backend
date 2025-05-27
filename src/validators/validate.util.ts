import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../errors/http.errors";

export function validateRequest<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "Request format not valid",
        validationErrors: errors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
