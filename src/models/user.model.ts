import { db } from "../db/db";
import { User } from "./interfaces/user.interfaces";

export async function findAll(): Promise<User[]> {
  const [rows] = await db.query("SELECT * FROM users");
  return rows as User[];
}

export async function findById(userId: number): Promise<User | null> {
  const [rows] = await db.query("SELECT * FROM users WHERE userId = ?", [
    userId,
  ]);
  const result = (rows as User[])[0];
  return result || null;
}

export async function create(user: User): Promise<any> {
  const { fullName, email, userName, password } = user;
  const [result]: any = await db.query(
    "INSERT INTO users (fullName, email, userName, password) VALUES (?, ?, ?, ?)",
    [fullName, email, userName, password]
  );
  return result;
}
