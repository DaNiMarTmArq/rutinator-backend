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
  const {username} = req.params;
  const userData = req.body;

  const result = await userService.updateByUsername(username, userData);
  res.status(HttpStatus.OK).json(result);
}

export async function updateImageByUsername(req: Request, res: Response) {
  const { username } = req.params;
  const image = req.file;
  if (!image) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: "Image file is required" });
    return;
  }
  const result = await userService.updateImageByUsername(username, image);
  res.status(HttpStatus.OK).json(result);
}