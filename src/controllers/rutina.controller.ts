import { Request, Response } from "express";
import * as rutinaService from "../services/rutina.service";

export async function addRutina(req: Request, res: Response) {
  const rutina = await rutinaService.añadirRutina(req.body);
  res.status(201).json({message: "rutina añadida"});
  }

  export async function modRutina(req: Request, res: Response) {
  const rutina = await rutinaService.modificarRutina(req.body);
  res.status(201).json({message: "rutina modificada"});
  }

  export const getRutinasByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const rutinas = await rutinaService.getRutinasByUser(userId);
    res.status(200).json(rutinas);
  } catch (error) {
    console.error('Error obteniendo rutinas:', error);
    res.status(500).json({ message: 'Error al obtener rutinas' });
  }
};