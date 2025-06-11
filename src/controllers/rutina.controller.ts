import { Request, Response } from "express";
import * as rutinaService from "../services/rutina.service";

export async function addRutina(req: Request, res: Response) {
  const rutina = await rutinaService.añadirRutina(req.body);
  res.status(201).json({message: "rutina añadida"});
  }