import { db } from "../db/db";
import { UserAvailability } from "./interfaces/availability.interfaces";

export async function findAllByUserId(
  userId: number
): Promise<UserAvailability[]> {
  const [rows] = await db.query(
    "SELECT * FROM users_availability WHERE users_id = ?",
    [userId]
  );
  return rows as UserAvailability[];
}
