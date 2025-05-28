import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  UserAuthenticatedResponse,
  UserLoginRequest,
  UserRegisterRequest,
} from "../models/interfaces/user.interfaces";
import {
  createUser,
  findByEmailOrUsername,
  findById,
  findByName,
} from "../models/user.model";
import {
  AppError,
  InvalidUserCredentials,
  TokenCreationError,
  UserAlreadyExistsError,
} from "../errors/errors";
import { HttpStatus } from "../errors/http.errors";

export async function login(
  credentials: UserLoginRequest
): Promise<UserAuthenticatedResponse> {
  const user = await findByName(credentials.username);

  if (!user) {
    throw new InvalidUserCredentials();
  }

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new InvalidUserCredentials();
  }

  const token = createToken({ userName: user.name, email: user.email });

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    token,
  };
}

export async function register(
  newUser: UserRegisterRequest
): Promise<UserAuthenticatedResponse> {
  const existingUser = await findByEmailOrUsername(
    newUser.email,
    newUser.username
  );
  if (existingUser) {
    throw new UserAlreadyExistsError();
  }

  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  newUser.password = hashedPassword;

  const insertId = await createUser(newUser);
  const savedUser = await findById(insertId);

  if (!savedUser)
    throw new AppError(
      "Error while creating the user",
      HttpStatus.INTERNAL_SERVER_ERROR
    );

  const token = createToken({
    userName: savedUser.name,
    email: savedUser.email,
  });

  return {
    id: savedUser.id,
    username: savedUser.username,
    name: savedUser.name,
    email: savedUser.email,
    token,
  };
}

interface UserDetails {
  userName: string;
  email: string;
}

function createToken(userDetails: UserDetails) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRATION = "1d";

  if (!JWT_SECRET) throw new TokenCreationError();

  return jwt.sign(userDetails, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}
