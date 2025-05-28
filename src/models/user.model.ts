import { db } from "../db/db";
import { User, UserRegisterRequest } from "./interfaces/user.interfaces";

export async function findAll(): Promise<User[]> {
  const [rows] = await db.query("SELECT * FROM users");
  return rows as User[];
}

export async function findById(userId: number): Promise<User | null> {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  const result = (rows as User[])[0];
  return result || null;
}

export async function findByEmailOrUsername(
  email: string,
  userName: string
): Promise<User | null> {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [email, userName]
  );
  return (rows as User[])[0] || null;
}

export async function findByName(userName: string): Promise<User | null> {
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
    userName,
  ]);
  const result = (rows as User[])[0];
  return result || null;
}

export async function createUser(user: UserRegisterRequest): Promise<number> {
  const { name, username, email, password } = user;
  const [result]: any = await db.query(
    "INSERT INTO users (name, username, email, password_hash) VALUES (?, ?, ?, ?)",
    [name, username, email, password]
  );
  return result.insertId as number;
}
