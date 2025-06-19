import { db } from "../db/db";

export async function insertarVersion(idRutina:number,version:number,selec:boolean): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result]:any = await db.query("INSERT INTO routines_versions(routines_id, version_number,created_at,is_selected)values (?,?,?,?)",[idRutina,version,fechaActual,selec]);
  return result.insertId as number; 
}

export async function comprobarVersion(idRutina:number):Promise<number>{
  console.log("ha entrado en el comprobar_version, el id =",idRutina);

  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result]:any = await db.query("SELECT MAX(version_number) As maximo FROM routines_versions WHERE routines_id = ?",[idRutina]);
  return result[0].maximo as number;
}