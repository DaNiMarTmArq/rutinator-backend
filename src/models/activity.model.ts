import { db } from "../db/db";
import {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
} from "./interfaces/activity.interfaces";

export async function findActivityByRoutineByDefault(id: number): Promise<Activity[]> {
  const [rows] = await db.query(
    `SELECT a.id, a.title, a.activity_categories_id, a.description,
      a.routines_versions_id, a.start_time, a.end_time, a.day_of_week 
      FROM activities a
      JOIN routines_versions rv ON a.routines_versions_id = rv.id
      JOIN routines r ON r.id = rv.routines_id
      JOIN users u ON u.id = r.users_id
      WHERE u.id = 21
      AND r.is_default = 1
      AND rv.id = (
        SELECT MAX(rv2.id)
        FROM routines_versions rv2
        JOIN routines r2 ON rv2.routines_id = r2.id
        WHERE r2.users_id = 21 AND r2.is_default = 1
  );`,
    [id] 
  );
  return rows as Activity[];
}

export async function findActivityByUserNameId(id: number): Promise<Activity[]> {
  const [rows] = await db.query(
    `SELECT a.id,
       a.routines_versions_id,
       a.activity_categories_id,
       a.title,
       a.description,
       a.day_of_week,
       a.start_time,
       a.end_time
    FROM activities a
    JOIN routines_versions rv ON a.routines_versions_id = rv.id
    JOIN routines r ON rv.routines_id = r.id
    WHERE r.users_id = ?;`,
    [id] 
  );
  return rows as Activity[];
}


export async function findActivitiesByRoutineVersion(
  routineVersionId: number
): Promise<Activity[]> {
  const [rows] = await db.query(
    "SELECT * FROM activities WHERE routines_versions_id = ?",
    [routineVersionId]
  );
  return rows as Activity[];
}
// Parte Dani

export async function findActivityById(id: number): Promise<Activity | null> {
  const [rows] = await db.query(
    "SELECT * FROM activities WHERE id = ? LIMIT 1",
    [id]
  );
  const results = rows as Activity[];
  return results.length ? results[0] : null;
}
export async function createActivity(
  data: CreateActivityRequest
): Promise<number> {
  const {
    routines_versions_id,
    title,
    description,
    activity_categories_id,
    day_of_week,
    start_time,
    end_time,
  } = data;

  const [result]: any = await db.query(
    `INSERT INTO activities (
      routines_versions_id,
      title,
      description,
      activity_categories_id,
      day_of_week,
      start_time,
      end_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      routines_versions_id,
      title,
      description,
      activity_categories_id,
      day_of_week,
      start_time,
      end_time,
    ]
  );

  return result.insertId;
}

export async function updateActivityById(
  id: number,
  updates: UpdateActivityRequest
): Promise<void> {
  const fields = Object.entries(updates).filter(
    ([_, value]) => value !== undefined
  );

  if (fields.length === 0) {
    throw new Error("No fields provided to update");
  }

  const setClause = fields.map(([key]) => `${key} = ?`).join(", ");
  const values = fields.map(([_, value]) => value);

  await db.query(`UPDATE activities SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
}

export async function deleteActivityById(id: number): Promise<void> {
  await db.query("DELETE FROM activities WHERE id = ?", [id]);
}
