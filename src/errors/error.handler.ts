import { Request, Response, NextFunction } from "express";
import { AppError } from "./errors";

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err instanceof AppError ? err.status : 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development")
    console.error("Global error handler: ", err);

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
