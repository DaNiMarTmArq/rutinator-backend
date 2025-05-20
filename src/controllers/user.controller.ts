// src/controllers/user.controller.ts
import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function login(req: Request, res: Response) {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const result = await userService.register(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}
