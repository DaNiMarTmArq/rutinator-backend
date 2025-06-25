import { db } from "../db/db";
import { insertar, modificar, obtenerTarea } from "../models/rutina.model";
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
  totalRegistros
} from "../models/rutinaVersion.model";
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

  const idRutina = await insertar(
    usuario,
    descripcion,
    name,
    defecto,
    shared,
    frequent
  );
  if (idRutina)
    idRutVersion = await insertarVersion(idRutina, version, is_Selected);
 
  return idRutVersion;
}

export async function modificarRutina(rutina: any): Promise<number> {
  const {
    descripcion,
    name,
    defecto,
    shared = false,
    frequent = false,
    id,
  } = rutina;

  let idRutVersion = 0;
  const is_Selected = false;
  const cambiado = await modificar(
    id,
    descripcion,
    name,
    defecto,
    shared,
    frequent
  );
  
  if (cambiado > 0) {
    let version = await comprobarVersion(id);
    
    version++;
    idRutVersion = await insertarVersion(id, version, is_Selected);
  }
  return idRutVersion;
}

export async function getRutinasByUser(userId: number) {
  const [rows] = await db.query(
    `SELECT r.id, r.name, r.description, r.created_at, r.is_default
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

export async function getRutinaConVersiones(id: number,page:number) {
  const rutina:any={};
  rutina.page=page;
  rutina.total = await totalRegistros(id);
  rutina.totalPage = (Math.ceil(rutina.total / 5));
  const offset = (page-1)*5;
  rutina.data = await obtenerRutinaConVersion(id,offset);
  
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

function createModelInput(
  interests: Interest[],
  objectives: Goals[],
  availability: UserAvailability[]
): ModelInput {
  const weekdayMap = [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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

export async function cambioVersionRutina(idRutina: number,idNVersion:number) {
 const idVersionSel = await obtenerVersionSeleccionada(idRutina);
  if (idVersionSel===idNVersion){
      return idNVersion;
  }
  else{
    await cambiarSeleccionado(false,idVersionSel);
    await cambiarSeleccionado(true,idNVersion);
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
    text: `El usuario ${usuario.username} compartido una rutina contigo`,
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