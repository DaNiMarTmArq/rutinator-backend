import { db } from "../db/db";
import { Category } from "./interfaces/categories.interface";

export async function getAllCategories(): Promise<Category[]> {
  const [rows] = await db.query("SELECT * FROM activity_categories");

  return rows as Category[];
}

