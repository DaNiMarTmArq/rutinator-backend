import { db } from "../db/db";

export async function insertar(users_id:number, descripcion:string, nombre:string, defecto:boolean, shared:boolean,frequent:boolean): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const [result]:any = await db.query("INSERT INTO routines(users_id, description, name,is_default,created_at,is_shared,is_frequent )values (?,?,?,?,?,?,?)",[users_id,descripcion,nombre,defecto,fechaActual,shared,frequent]);
  return result.insertId as number; 
}