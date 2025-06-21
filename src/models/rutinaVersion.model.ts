import { db } from "../db/db";

export async function insertarVersion(idRutina:number,version:number,selec:boolean): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result]:any = await db.query("INSERT INTO routines_versions(routines_id, version_number,created_at,is_selected)values (?,?,?,?)",[idRutina,version,fechaActual,selec]);
  return result.insertId as number; 
}

export async function comprobarVersion(idRutina:number):Promise<number>{
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result]:any = await db.query("SELECT MAX(version_number) As maximo FROM routines_versions WHERE routines_id = ?",[idRutina]);
  return result[0].maximo as number;
}
export async function obtenerTareaConVersion(idRutina:number):Promise<number>{
  const [result]:any = await db.query("select r.id,r.name,r.description,rv.version_number,rv.created_at from routines r inner join routines_versions rv ON r.id=rv.routines_id where r.id=?",[idRutina]);
  return result;
}