import * as rutinaModel from "../models/rutina.model";
import { insertar, modificar, obtenerTarea } from "../models/rutina.model";
import { findByName } from "../models/user.model";
import {
  insertarVersion,
  comprobarVersion,
} from "../models/rutinaVersion.model";
import { db } from "../db/db";
import { OpenAIClient } from "../utils/openai.client";

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
  const cambiado = await modificar(
    id,
    descripcion,
    name,
    defecto,
    shared,
    frequent
  );
  console.log("CAmbiado:", cambiado);
  if (cambiado > 0) {
    let version = await comprobarVersion(id);
    console.log("La version es:", version);
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

export async function generateRecommendedRoutine(
  routineId: number,
  userId: number
) {
  const modelClient = new OpenAIClient();
  const generatedRoutines = await modelClient.generate();
  return generatedRoutines;
}
