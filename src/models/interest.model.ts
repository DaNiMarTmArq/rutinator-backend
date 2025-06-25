import { db } from "../db/db";
import { Interest } from "./interfaces/interest.interfaces";

export async function createInterest(interestName: string): Promise<number> {
  const [result]: any = await db.query(
    "INSERT INTO interests (interest_name) VALUES (?)",
    [interestName]
  );
  return result.insertId as number;
}

export async function getInterestById(
  interestId: number
): Promise<Interest | null> {
  const [rows] = await db.query("SELECT * FROM interests WHERE id = ?", [
    interestId,
  ]);
  const result = (rows as Interest[])[0];
  return result || null;
}

export async function getInterestByNameForUser(
  interestName: string,
  userId: number
): Promise<Interest | null> {
  const [rows] = await db.query(
    "SELECT * FROM users_interests WHERE interest_name = ? AND users_id = ?",
    [interestName, userId]
  );

  return (rows as Interest[])[0] || null;
}

export async function createInterestForUser(
  interestName: string,
  userId: number,
  color?: string
): Promise<number> {
  const [result]: any = await db.query(
    "INSERT INTO users_interests (interest_name, users_id, color) VALUES (?, ?, ?)",
    [interestName, userId, color || null]
  );
  return result.insertId as number;
}

export async function getAllInterestsByUser(
  userId: string
): Promise<Interest[]> {
  const [rows] = await db.query(
    "SELECT * FROM users_interests WHERE users_id = ?;",
    [userId]
  );
  return rows as Interest[];
}

export async function userHasInterest(
  userId: number,
  interestId: number
): Promise<boolean> {
  const [rows] = await db.query(
    "SELECT 1 FROM users_interests WHERE users_id = ? AND interests_id = ? LIMIT 1",
    [userId, interestId]
  );
  return (rows as any[]).length > 0;
}

export async function removeInterestById(interestId: number): Promise<void> {
  await db.query("DELETE FROM users_interests WHERE id = ?", [interestId]);
}

export async function updateInterestByIdModel(
  interestId: number,
  interestName: string,
  color: string
): Promise<void> {
  await db.query(
    `UPDATE users_interests ui
        SET interest_name = ?,
            color = ?
      WHERE ui.id = ?`,
    [interestName, color, interestId]
  );
}