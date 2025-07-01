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
  deleteUser,
  findEmailByName,
  updatePassword,
} from "../models/user.model";
import {
  AppError,
  InvalidUserCredentials,
  TokenCreationError,
  UserAlreadyExistsError,
} from "../errors/errors";
import { HttpStatus } from "../errors/http.errors";
import nodemailer from "nodemailer";

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

  const token = createToken({ userName: user.username, email: user.email, id: user.id });

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
    id: savedUser.id
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
  id: number;
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

export async function getById(
  userId: number
): Promise<User> {
  const user = await findById(userId);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return user;
}


function createToken(userDetails: UserDetails) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRATION = "1d";

  if (!JWT_SECRET) throw new TokenCreationError();

  return jwt.sign(userDetails, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

export async function deleteUserByUsername(username: string) {
  const user = await findByName(username);

  if (!user) {
    throw new InvalidUserCredentials();
  }

  const result = await deleteUser(username);  
}

export async function getEmailByUsername(username: string): Promise<any> {
  
  const email = await findEmailByName(username);
  if (!email) {
    throw new InvalidUserCredentials(); 
  }

  console.log("User email found:", email);
  return email;
}

export async function sendVerificationCode(
  emailDestino: string,
  codigo: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rutinatorunir@gmail.com",
      pass: "cwsj ztqk vwuc izkf", 
    },
  });

  const mailOptions = {
    from: '"Rutinator" <rutinatorunir@gmail.com>',
    to: emailDestino,
    subject: "Código de verificación",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #0fa3b1; text-align: center;">Verificación de cuenta</h2>
          <p>Hola,</p>
          <p>Has solicitado un código para recuperar tu cuenta en <strong>Rutinator</strong>. Introduce el siguiente código en la aplicación:</p>
  
          <div style="margin: 30px auto; padding: 20px; background-color: #f9fafb; border-radius: 8px; text-align: center; border: 1px solid #ddd; width: fit-content;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #333;">${codigo}</span>
          </div>
  
          <p style="font-size: 14px; color: #555;">
            Si no has solicitado este código, puedes ignorar este correo.
          </p>
  
          <p style="font-size: 14px; color: #555;">Gracias,<br/>El equipo de Rutinator</p>
        </div>
      </div>
    `,
  };
  

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error enviando correo:", error);
        reject(error);
      } else {
        console.log("Correo enviado:", info.response);
        resolve();
      }
    });
  });
}

export async function updatePasswordByUsername(
  username: string,
  newPassword: string
): Promise<void> {
  const user = await findByName(username);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await updatePassword(username, hashedPassword);
}

