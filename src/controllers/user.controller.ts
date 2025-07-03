import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { HttpStatus } from "../errors/http.errors";

export async function login(req: Request, res: Response) {
  const result = await userService.login(req.body);
  res.status(HttpStatus.CREATED).json(result);
}

export async function register(req: Request, res: Response) {
  const result = await userService.register(req.body);
  res.json(result);
}

export async function getByUsername(req: Request, res: Response) {
  const { username } = req.params;
  const result = await userService.getByUsername(username);
  res.status(HttpStatus.OK).json(result);
}

export async function updateByUsername(req: Request, res: Response) {
  const { username } = req.params;
  const userData = req.body;

  const result = await userService.updateByUsername(username, userData);
  res.status(HttpStatus.OK).json(result);
}

export async function updateImageByUsername(req: Request, res: Response) {
  const { username } = req.params;
  const image = req.file;
  if (!image) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ error: "Image file is required" });
    return;
  }
  const result = await userService.updateImageByUsername(username, image);
  res.status(HttpStatus.OK).json(result);
}

export async function deleteUserByUsername(req: Request, res: Response) {
  const { username } = req.params;
  
  const result = await userService.deleteUserByUsername(username);
  res.status(HttpStatus.OK).json(result);
}

export async function getEmailByUsername(req: Request, res: Response) {
  const { username } = req.params;
  try {
    const result = await userService.getEmailByUsername(username);
    res.status(HttpStatus.OK).json({ email: result }); 
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND).json({ message: "Usuario no encontrado" });
  }
}

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    await userService.sendVerificationCode(email, code);
    res.status(200).json({ message: "Correo enviado" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ message: "Error interno" });
  }
}

export async function updatePasswordByUsername(req: Request, res: Response) {
  const { username } = req.params;
  const {newPassword} = req.body;

  const result = await userService.updatePasswordByUsername(username, newPassword);
  res.status(HttpStatus.OK).json(result);
}