import { db } from "../db/db";

export async function insertar(users_id:number, descripcion:string, nombre:string, defecto:boolean, shared:boolean,frequent:boolean): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const defec = defecto ? 1 : 0;
  const [result]:any = await db.query("INSERT INTO routines(users_id, description, name,is_default,created_at,is_shared,is_frequent )values (?,?,?,?,?,?,?)",[users_id,descripcion,nombre,defec,fechaActual,shared,frequent]);
  return result.insertId as number; 
}

export async function modificar(id_rutinas:number,descripcion:string, nombre:string, defecto:boolean, shared:boolean,frequent:boolean): Promise<number> {
  const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const defec = defecto ? 1 : 0;
  const [result]:any = await db.query( `UPDATE routines
     SET name = ?, description = ?, created_at = ? 
     WHERE id = ?`,
    [nombre, descripcion, fechaActual,id_rutinas]);
console.log("result",result);
  return result.changedRows as number; 
}

export async function obtenerTarea(id:number):Promise<any>{
  const [rows]:any = await db.query(`SELECT * FROM routines r WHERE r.id = ?`,[id]);
  return rows;
}

  
