import { Request, Response, NextFunction } from "express";
import { getCategories } from "../services/categories.service";
import { UserNotFoundError } from "../errors/errors";

export async function getCategoriesController(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({ message: "No categories found." });
    } else {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  }
}
