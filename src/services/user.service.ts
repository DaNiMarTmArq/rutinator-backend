import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  UserAuthenticatedResponse,
  UserLoginRequest,
} from "../models/interfaces/user.interfaces";
import { findByName } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = "1d";

export async function login(
  credentials: UserLoginRequest
): Promise<UserAuthenticatedResponse> {
  const user = await findByName(credentials.username);

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("Invalid username or password");
  }

  if (!JWT_SECRET) throw new Error("Error creating the token");

  const token = jwt.sign(
    { userName: user.userName, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token,
  };
}
