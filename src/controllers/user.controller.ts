// src/controllers/user.controller.ts
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
