import { Request, Response } from "express";
import * as rutinaService from "../services/rutina.service";

export async function addRutina(req: Request, res: Response) {
  const interest = await rutinaService.insertar(req.body);
  }//);
//}