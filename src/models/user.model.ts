import { db } from "../db/db";
import { User, UserRegisterRequest, UserUpdate } from "./interfaces/user.interfaces";

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


export async function updateUser(
  oldUsername: string,
  user: Partial<UserUpdate>
): Promise<void> {
  const { name, email, username, password } = user;
  await db.query(
    "UPDATE users SET name = ?, email = ?, username = ?, password_hash = ? WHERE username = ?",
    [name, email, username, password, oldUsername]
  );
}

export async function updateImage(
  username: string,
  image: Express.Multer.File
): Promise<void> {
  await db.query(
    "UPDATE users SET image = ? WHERE username = ?",
    [image.buffer, username]
  );
}

