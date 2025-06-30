import { Request, Response } from "express";
import * as rutinaService from "../services/rutina.service";
import { HttpStatus } from "../errors/http.errors";

export async function addRutina(req: Request, res: Response) {
  const rutina = await rutinaService.añadirRutina(req.body);
  res.status(201).json({ message: "rutina añadida" });
}

export async function addRutinaGenerada(req: Request, res: Response) {
  const { idRutVersion, idRutina } = await rutinaService.añadirRutinaGenerada(
    req.body
  );
  res
    .status(201)
    .json({ message: "rutina generada añadida", idRutVersion, idRutina });
}

export async function modRutina(req: Request, res: Response) {
  console.log("En el controller:req" + req.body);
  const rutina = await rutinaService.modificarRutina(req.body);
  res.status(201).json({ message: "rutina modificada" });
}

export const getRutinasByUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const rutinas = await rutinaService.getRutinasByUser(userId);
    res.status(200).json(rutinas);
  } catch (error) {
    console.error("Error obteniendo rutinas:", error);
    res.status(500).json({ message: "Error al obtener rutinas" });
  }
};
export const getRutinasId = async (req: Request, res: Response) => {
  try {
    console.log("Esta en el controler, el req tiene:", req.params.id);
    const rutinas = await rutinaService.getRutinasById(Number(req.params.id));
    res.status(200).json(rutinas);
  } catch (error) {
    console.error("Error obteniendo rutinas:", error);
    res.status(500).json({ message: "Error al obtener rutinas" });
  }
};

export async function generateRoutine(req: Request, res: Response) {
  const { userId } = req.params;
  const generatedRoutine = await rutinaService.generateRecommendedRoutine(
    parseInt(userId)
  );
  res.status(HttpStatus.OK).json(generatedRoutine);
}

export const getRutinaVersion = async (req: Request, res: Response) => {
  try {
    console.log("Esta en el controler, el req tiene:", req.params.id);
    console.log("Esta en el controler, el req tiene:", req.params.page);
    const rutinas = await rutinaService.getRutinaConVersiones(
      Number(req.params.id),
      Number(req.params.page)
    );
    res.status(200).json(rutinas);
  } catch (error) {
    console.error("Error obteniendo rutinas:", error);
    res.status(500).json({ message: "Error al obtener rutinas" });
  }
};

export const modVersionDefecto = async (req: Request, res: Response) => {
  try {
    const idVersion = req.body.idVersion;
    const idVersionDef = await rutinaService.cambioVersionRutina(
      Number(req.params.id),
      idVersion
    );
    res.status(200).json(idVersionDef);
  } catch (error) {
    console.error("Error modificando la version:", error);
    res.status(500).json({ message: "Error modificando version:" });
  }
};

export const getRutinaPdf = async (req: Request, res: Response) => {
  const rutinaId = Number(req.params.rutinaId);

  try {
    const pdfStream = await rutinaService.generarPdfRutinas(rutinaId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=rutina-${rutinaId}.pdf`
    );

    pdfStream.pipe(res);
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).send("Error al generar el PDF");
  }
}

export const sendRutinaByEmail = async (req: Request, res: Response) => {
  const rutinaId = Number(req.params.rutinaId);
  const { email } = req.body;

  try {
    await rutinaService.enviarRutinaPorCorreo(rutinaId, email);
    res.status(200).json({ message: "Correo enviado" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ message: "Error interno" });
  }
}

export const deleteRutinaId= async (req: Request, res: Response) => {
   try {
    const idRutinaB = await rutinaService.borrarRutina(Number(req.params.id));
    res.status(200).json({ message: "Rutina borrada" });
  } catch (error) {
    console.error('Error borrando rutina:', error);
    res.status(500).json({ message: 'Error borrando rutina:' });
  }
};

