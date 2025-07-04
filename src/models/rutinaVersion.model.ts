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
export async function obtenerRutinaConVersion(idRutina:number,offset:number):Promise<any>{
  const [result]:any = await db.query("SELECT COUNT(a.id) AS numActividades,r.id,rv.id AS idVersion,r.name,r.description,rv.version_number,rv.created_at,rv.is_selected FROM routines_versions rv INNER JOIN routines r ON r.id = rv.routines_id LEFT JOIN activities a ON a.routines_versions_id = rv.id WHERE r.id = ? GROUP BY r.id,rv.id,r.name,r.description,rv.version_number,rv.created_at LIMIT 5 OFFSET ?",[idRutina,offset]);
  return result;
}

export async function obtenerVersionSeleccionada(rutina:number):Promise<number>{
  const selected =true;
  const [result]:any = await db.query("select id from routines_versions where routines_id=? and is_selected=?",[rutina,selected]);
  return result[0].id as number;
}

export async function cambiarSeleccionado(selected:boolean,idVersion:number):Promise<number>{
 const [result]:any = await db.query( `UPDATE routines_versions
     SET is_Selected = ?
     WHERE id = ?`,
    [selected, idVersion]);
  return result.changedRows as number;
}

export async function totalRegistros(idRutina:number):Promise<number>{
  const [result]:any = await db.query("SELECT count(*) as total FROM routines_versions WHERE routines_id = ?",[idRutina]);
  return result[0].total as number;
}

export async function obtenerVersionesByIdRutina(idRutina:number):Promise<any>{
  const [result]: any = await db.query(
    "select * from routines_versions where routines_id=?",
    [idRutina]
  );
  return result;
}
export async function borrarVersion(idRutina:number):Promise<number>{
  const [result]: any = await db.query(
    "delete rv from routines_versions rv inner join routines r on r.id=rv.routines_id where r.id = ?",
    [idRutina]);
  
  return idRutina
}

