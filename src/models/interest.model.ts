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

export async function getInterestByName(
  interestName: string
): Promise<Interest | null> {
  const [rows] = await db.query(
    "SELECT * FROM interests WHERE interest_name = ?",
    [interestName]
  );

  const result = (rows as Interest[])[0];
  return result || null;
}

export async function addInterestToUser(
  interestId: number,
  userId: string
): Promise<number> {
  try {
    const [result]: any = await db.query(
      "INSERT INTO users_interests (users_id, interests_id) VALUES (?, ?);",
      [userId, interestId]
    );
    return result.insertId as number;
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error(
        `Foreign key constraint failed: either user ID or interest does not exist.`
      );
    } else if (error.code === "ER_DUP_ENTRY") {
      throw new Error(`User is already linked to that interest.`);
    }
    throw error;
  }
}

export async function getAllInterestsByUser(
  userId: string
): Promise<Interest[]> {
  const [rows] = await db.query(
    "SELECT i.* FROM interests i JOIN users_interests ui ON ui.interests_id = i.id WHERE ui.users_id = ?;",
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

export async function removeInterestFromUser(
  userId: number,
  interestId: number
): Promise<void> {
  await db.query(
    "DELETE FROM users_interests WHERE users_id = ? AND interests_id = ?",
    [userId, interestId]
  );
}
