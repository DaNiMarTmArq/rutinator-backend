import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  User,
  UserAuthenticatedResponse,
  UserLoginRequest,
  UserRegisterRequest,
  UserUpdate,
} from "../models/interfaces/user.interfaces";
import {
  createUser,
  findByEmailOrUsername,
  findById,
  findByName,
  updateImage,
  updateUser,
} from "../models/user.model";
import {
  AppError,
  InvalidUserCredentials,
  TokenCreationError,
  UserAlreadyExistsError,
} from "../errors/errors";
import { HttpStatus } from "../errors/http.errors";

const mime = require("mime-types");

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

  const token = createToken({ userName: user.username, email: user.email });

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
    userName: savedUser.username,
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

export async function getByUsername(username: string): Promise<any> {
  const user = await findByName(username);

  if (!user) {
    throw new InvalidUserCredentials();
  }

  const base64Image = user.image
    ? Buffer.from(user.image).toString("base64")
    : null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    created_at: user.created_at,
    image: base64Image,
  };
}

export async function updateByUsername(
  username: string,
  user: UserUpdate
): Promise<User> {
  if (user.password === "") {
    const oldUser = await findByName(username);
    console.log("Old User", oldUser);
    if (!oldUser) {
      throw new AppError(
        "Error while updating the user",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    user.password = oldUser.password_hash;
  } else {
    user.password = await bcrypt.hash(user.password, 10);
  }

  const insertId = await updateUser(username, user);

  const updatedUser = await getByUsername(user.username);
  if (!updatedUser) {
    throw new AppError(
      "Error while updating the user",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  return updatedUser;
}

export async function updateImageByUsername(
  username: string,
  image: Express.Multer.File
): Promise<User> {
  const user = await findByName(username);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const result = await updateImage(username, image);

  const updated = await getByUsername(username);
  return updated;
}

function createToken(userDetails: UserDetails) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRATION = "1d";

  if (!JWT_SECRET) throw new TokenCreationError();

  return jwt.sign(userDetails, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}
