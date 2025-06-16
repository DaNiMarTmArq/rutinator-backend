import { db } from "../db/db";

export async function insertarVersion(idRutina:number,version:number,selected:boolean): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result]:any = await db.query("INSERT INTO routines_versions(routines_id, version_number,created_at,is_selected)values (?,?,?,?)",[idRutina,version,fechaActual,selected]);
  return result.insertId as number; 
}

export async function comprobarVersion(idRutina:number):Promise<number>{
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result]:any = await db.query("SELECT MAX(numero_version) FROM rutinas_versiones WHERE id_rutina = ?",[idRutina]);
  return result as number; 
}