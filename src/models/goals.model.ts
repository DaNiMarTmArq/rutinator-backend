import { db } from "../db/db";
import { Goals } from "./interfaces/goals.interfaces";

export async function createGoals(goalsName: string): Promise<number> {
  const [result]: any = await db.query(
    "INSERT INTO users_goals (goals_name) VALUES (?)",
    [goalsName]
  );
  return result.insertId as number;
}

export async function getGoalsById(
  goalsId: number
): Promise<Goals | null> {
  const [rows] = await db.query("SELECT * FROM users_goals WHERE id = ?", [
    goalsId,
  ]);
  const result = (rows as Goals[])[0];
  return result || null;
}


export async function getGoalsByName(
  goalsName: string
): Promise<Goals | null> {
  const [rows] = await db.query(
    "SELECT * FROM users_goals WHERE goals_name = ?",
    [goalsName]
  );

  const result = (rows as Goals[])[0];
  return result || null;
  
}


export async function addGoalsToUser(
  userId: number,
  interestsId: number,
  goalName: string,
  goalDescription: string,
  hoursPerWeek: number
): Promise<number> {
  try {
    const [result]: any = await db.query(
      "INSERT INTO users_goals (users_id, interests_id, goals_name, description, hours_per_week) VALUES (?, ?, ?, ?, ?);",
      [userId, interestsId, goalName, goalDescription, hoursPerWeek]
    );
    return result.insertId as number;
  } catch (error: any) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      throw new Error(
        `Foreign key constraint failed: either user ID or goals does not exist.`
      );
    } else if (error.code === "ER_DUP_ENTRY") {
      throw new Error(`User is already linked to that goals.`);
    }
    throw error;
  }
}

export async function getAllGoalsByUser(
  userId: string
): Promise<Goals[]> {
  const [rows] = await db.query(
    `SELECT ug.* 
       FROM users_goals ug
      WHERE users_id = ?;`,
    [userId]
  );
  return rows as Goals[];
}

export async function userHasGoals(
  userId: number,
  goalsId: number
): Promise<boolean> {
  const [rows] = await db.query(
    "SELECT 1 FROM users_goals WHERE users_id = ? AND id = ? LIMIT 1",
    [userId, goalsId]
  );
  return (rows as any[]).length > 0;
}

export async function removeGoalsFromUser(
  userId: number,
  goalsId: number
): Promise<void> {
  await db.query(
    "DELETE FROM users_goals WHERE users_id = ? AND id = ?",
    [userId, goalsId]
  );
}
