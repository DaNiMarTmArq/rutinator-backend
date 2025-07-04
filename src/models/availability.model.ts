import { db } from "../db/db";
import {
  CreateAvailabilityRequest,
  UserAvailability,
} from "./interfaces/availability.interfaces";

export async function findAllByUserId(
  userId: number
): Promise<UserAvailability[]> {
  const [rows] = await db.query(
    "SELECT * FROM users_availability WHERE users_id = ? ORDER BY weekday ASC, start_time ASC",
    [userId]
  );
  return rows as UserAvailability[];
}

export async function existsAvailability(
  user_id: number,
  weekday: number,
  start_time: string,
  end_time: string
): Promise<boolean> {
  const [rows] = await db.query(
    `SELECT 1 FROM users_availability
     WHERE users_id = ? AND weekday = ? AND start_time = ? AND end_time = ?
     LIMIT 1`,
    [user_id, weekday, start_time, end_time]
  );
  return (rows as any[]).length > 0;
}

export async function createAvailability(
  data: CreateAvailabilityRequest
): Promise<number> {
  const { user_id, weekday, start_time, end_time } = data;

  const [result]: any = await db.query(
    "INSERT INTO users_availability (users_id, weekday, start_time, end_time) VALUES (?, ?, ?, ?)",
    [user_id, weekday, start_time, end_time]
  );

  return result.insertId as number;
}

export async function existsAvailabilityById(
  availabilityId: number,
  userId: number
): Promise<boolean> {
  const [rows] = await db.query(
    `SELECT 1 FROM users_availability
     WHERE id = ? AND users_id = ?
     LIMIT 1`,
    [availabilityId, userId]
  );
  return (rows as any[]).length > 0;
}

export async function updateAvailabilityById(
  availabilityId: number,
  updates: Partial<Omit<UserAvailability, "id">>
): Promise<void> {
  const fields = Object.entries(updates).filter(
    ([_, value]) => value !== undefined
  );

  if (fields.length === 0) {
    throw new Error("No fields provided to update");
  }

  const setClause = fields.map(([key]) => `${key} = ?`).join(", ");
  const values = fields.map(([_, value]) => value);

  await db.query(`UPDATE users_availability SET ${setClause} WHERE id = ?`, [
    ...values,
    availabilityId,
  ]);
}

export async function deleteAvailabilityById(availabilityId: number) {
  await db.query("DELETE FROM users_availability WHERE id = ?", [
    availabilityId,
  ]);
}
