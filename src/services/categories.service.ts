import { UserNotFoundError } from "../errors/errors";
import { getAllCategories } from "../models/categories.model";
import { Category } from "../models/interfaces/categories.interface";

export async function getCategories(): Promise<Category[]> {

const categorias = await getAllCategories();

  if (categorias === null || categorias === undefined) {

    throw new UserNotFoundError();
  }
  return categorias;
}