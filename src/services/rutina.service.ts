import { db } from "../db/db";
import { insertar, modificar, obtenerTarea } from "../models/rutina.model";
import { ModelInput, OpenAIClient } from "../utils/openai.client";
import { getByUserId } from "./interest.service";
import { getByUserId as getGoaldByUserId } from "./goals.service";
import { getSchedulesByUser } from "./availability.service";
import { Interest } from "../models/interfaces/interest.interfaces";
import { Goals } from "../models/interfaces/goals.interfaces";
import { UserAvailability } from "../models/interfaces/availability.interfaces";
import {insertarVersion,comprobarVersion,obtenerTareaConVersion} from "../models/rutinaVersion.model";

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
  const is_Selected = false;
  //const usu = await findByName(usuario);
  //if (usu){

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
  //}
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
    const cambiado= await modificar(id,descripcion,name,defecto,shared,frequent);
    console.log("CAmbiado:",cambiado);
    if (cambiado>0){
      let version = await comprobarVersion(id);
      console.log("La version es:",version);
      version++;
      idRutVersion= await insertarVersion(id,version,is_Selected);
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

export async function getRutinaConVersiones(id: number) {
  const rutina = obtenerTareaConVersion(id);
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
    description: "",
    hours_per_week: parseInt(goal.hours_per_week),
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
