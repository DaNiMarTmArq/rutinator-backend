import { db } from "../db/db";
import {
  CreateAvailabilityRequest,
  UserAvailability,
} from "./interfaces/availability.interfaces";

export async function findAllByUserId(
  userId: number
): Promise<UserAvailability[]> {
  const [rows] = await db.query(
    "SELECT * FROM users_availability WHERE users_id = ?",
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
