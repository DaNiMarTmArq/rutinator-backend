import { db } from "../db/db";
import { User } from "./interfaces/user.interfaces";

export async function findAll(): Promise<User[]> {
  const [rows] = await db.query("SELECT * FROM users");
  return rows as User[];
}

export async function findById(userId: number): Promise<User | null> {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  const result = (rows as User[])[0];
  return result || null;
}

export async function findByName(userName: string): Promise<User | null> {
  const [rows] = await db.query("SELECT * FROM users WHERE name = ?", [
    userName,
  ]);
  const result = (rows as User[])[0];
  return result || null;
}

export async function create(user: User): Promise<User> {
  const { name, email, password_hash } = user;
  const [result]: any = await db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?, ?)",
    [name, email, password_hash]
  );
  return result as User;
}
