import { db } from "../db/db";
import {
  crearNuevaVersionRutina,
  insertar,
  modificar,
  obtenerTarea,
  modificarDefecto,
  deleteRutina,
  currentVersionSelected
} from "../models/rutina.model";
import { ModelInput, OpenAIClient } from "../utils/openai.client";
import { getByUserId } from "./interest.service";
import { getByUserId as getGoaldByUserId } from "./goals.service";
import { getSchedulesByUser } from "./availability.service";
import { getById as findUserById} from "./user.service";
import { Interest } from "../models/interfaces/interest.interfaces";
import { Goals } from "../models/interfaces/goals.interfaces";
import { UserAvailability } from "../models/interfaces/availability.interfaces";
import {
  insertarVersion,
  comprobarVersion,
  obtenerRutinaConVersion,
  obtenerVersionSeleccionada,
  cambiarSeleccionado,
  totalRegistros,
  borrarVersion
} from "../models/rutinaVersion.model";
import{
  borrarActividad
}
from "../models/activity.model";

import { Readable } from "stream";
import { pdfRutinasUtil } from "../utils/pdfGenerator";
import nodemailer from "nodemailer";
import { User } from "../models/interfaces/user.interfaces";

export async function añadirRutina(rutina: any): Promise<number> {
  const {
    usuario,
    descripcion,
    name,
    defecto,
    shared = false,
    frequent = false,
  } = rutina;

  let idRutVersion = 0;
  const version = 1;
  const is_Selected = true;
  let valor = 0;

  const idRutina = await insertar(
    usuario,
    descripcion,
    name,
    defecto,
    shared,
    frequent
  );
  if (idRutina) {
    if (defecto == true) {
      console.log("La rutina es:", idRutina);
      valor = await modificarDefecto(idRutina, usuario);
    }
    idRutVersion = await insertarVersion(idRutina, version, is_Selected);
  }

  return idRutVersion;
}

export async function añadirRutinaGenerada(
  rutina: any
): Promise<{ idRutVersion: number; idRutina: number }> {
  const {
    usuario,
    description,
    name,
    defecto,
    shared = false,
    frequent = false,
  } = rutina;

  let idRutVersion = 0;
  const version = 1;
  const is_Selected = true;
  let valor = 0;

  const idRutina = await insertar(
    usuario,
    description,
    name,
    defecto,
    shared,
    frequent
  );
  if (idRutina) {
    if (defecto == true) {
      valor = await modificarDefecto(idRutina, usuario);
    }
    idRutVersion = await insertarVersion(idRutina, version, is_Selected);
  }

  return { idRutVersion, idRutina };
}

export async function modificarRutina(rutina: any): Promise<number> {
  const {
    descripcion,
    name,
    defecto,
    shared = false,
    frequent = false,
    id,
    usuario,
  } = rutina;

  let idRutVersion = 0;
  const is_Selected = true;
  const cambiado = await modificar(
    id,
    descripcion,
    name,
    defecto,
    shared,
    frequent
  );
  if (cambiado > 0) {
    if (defecto == true) {
      const valor = await modificarDefecto(id, usuario);
    }
    const idVersionSel = await obtenerVersionSeleccionada(id);
    let version = await comprobarVersion(id);
     await cambiarSeleccionado(false, idVersionSel);
    version++;
   
    idRutVersion = await insertarVersion(id, version, is_Selected);
  }
  return idRutVersion;
}

export async function getRutinasByUser(userId: number) {
  const [rows] = await db.query(
    `SELECT 
      r.id,
      r.name,
      r.description,
      r.created_at,
      r.is_default,
      (
        SELECT COUNT(*)
        FROM activities a
        WHERE a.routines_versions_id = (
          SELECT rv.id
          FROM routines_versions rv
          WHERE rv.routines_id = r.id
          AND rv.is_selected = 1
          LIMIT 1
        )
      ) AS activity_count
    FROM routines r
    WHERE r.users_id = ?`,
    [userId]
  );

  return rows;
}

export async function getRutinasById(id: number) {
  const rutina = obtenerTarea(id);

  return rutina;
}

export async function getRutinaConVersiones(id: number, page: number) {
  const rutina: any = {};
  rutina.page = page;
  rutina.total = await totalRegistros(id);
  rutina.totalPage = Math.ceil(rutina.total / 5);
  const offset = (page - 1) * 5;
  rutina.data = await obtenerRutinaConVersion(id, offset);

  return rutina;
}

export async function generateRecommendedRoutine(userId: number) {
  const modelClient = new OpenAIClient();
  const userIdString = String(userId);

  const interests = await getByUserId(userIdString);
  const objectives = await getGoaldByUserId(userIdString);
  const availability = await getSchedulesByUser(userIdString);

  const input = createModelInput(interests, objectives, availability);

  const generatedRoutines = await modelClient.generate(input);
  return generatedRoutines;
}

export async function getSelectedVersion(routineId: number): Promise<number> {
  return await currentVersionSelected(routineId);
}

function createModelInput(
  interests: Interest[],
  objectives: Goals[],
  availability: UserAvailability[]
): ModelInput {
  const weekdayMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const intereses = interests.map((interest, index) => ({
    id: index + 1,
    name: interest.interest_name,
  }));

  const objetivos = objectives.map((goal, index) => ({
    id: index + 1,
    title: goal.goals_name,
    description: goal.description,
    hours_per_week: goal.hours_per_week,
  }));

  const disponibilidad = availability.map((slot, index) => ({
    id: index + 1,
    day_of_week: weekdayMap[slot.weekday],
    start_time: slot.start_time,
    end_time: slot.end_time,
  }));

  return {
    intereses,
    objetivos,
    disponibilidad,
  };
}

export async function cambioVersionRutina(
  idRutina: number,
  idNVersion: number
) {
  const idVersionSel = await obtenerVersionSeleccionada(idRutina);
  if (idVersionSel === idNVersion) {
    return idNVersion;
  } else {
    await cambiarSeleccionado(false, idVersionSel);
    await cambiarSeleccionado(true, idNVersion);
  }
  return idNVersion;
}
export async function generarPdfRutinas(id: number): Promise<Readable> {
  return await pdfRutinasUtil(id);
}

export async function enviarRutinaPorCorreo(
  rutinaId: number,
  emailDestino: string
): Promise<void> {
  const pdfStream = await pdfRutinasUtil(rutinaId);

    const rutinaRes = await getRutinasById(rutinaId);
    if (!rutinaRes) throw new Error("No se encontró la rutina");
    const rutina = rutinaRes[0];

    const usuario : User = await findUserById(rutina.users_id);
    if (!usuario) throw new Error("No se encontró el usuario");


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
    subject: `Rutina compartida`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #0fa3b1; text-align: center; margin-bottom: 20px;">
            🏋️ ¡Alguien ha compartido una rutina contigo!
          </h2>
  
          <p style="font-size: 16px; color: #333;">
            Hola,
          </p>
  
          <p style="font-size: 16px; color: #333;">
            El usuario <strong>${usuario.username}</strong> ha compartido contigo una rutina personalizada a través de <strong>Rutinator</strong>.
          </p>
  
          <div style="margin: 30px 0; background-color: #e8f6f9; padding: 20px; border-left: 4px solid #0fa3b1; border-radius: 8px;">
            <p style="margin: 0; font-size: 15px; color: #0a4c52;">
              Puedes encontrar la rutina adjunta en formato PDF. ¡Esperamos que te motive y te ayude a alcanzar tus objetivos!
            </p>
          </div>
  
          <p style="font-size: 14px; color: #666;">
            Si no esperabas este mensaje, puedes ignorarlo con seguridad.
          </p>
  
          <p style="font-size: 14px; color: #666;">Un saludo,<br><strong>El equipo de Rutinator</strong></p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `rutina-${rutinaId}.pdf`,
        content: pdfStream,
        contentType: "application/pdf",
      },
    ],
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

/**
 * Servicio para crear una nueva versión de rutina.
 * @param rutinaId ID de la rutina existente
 * @param seleccionada Si esta nueva versión debe ser la seleccionada
 * @returns ID de la nueva versión creada
 */
export async function crearNuevaVersionRutinaService(
  rutinaId: number,
  seleccionada: boolean = false
): Promise<number> {
  return await crearNuevaVersionRutina(rutinaId, seleccionada);
}

export async function borrarRutina(idRutina:number): Promise<number> {
  const rutina = await obtenerTarea(idRutina);
  if (rutina.length!=0 && rutina.is_default===0){
    const result =await borrarActividad(idRutina);
    await borrarVersion(idRutina);
    await deleteRutina(idRutina);
  }
  else{
    throw {message: "No se puede borrar una rutina por defecto o rutina no encontrada"};
  }
  return idRutina;
}
