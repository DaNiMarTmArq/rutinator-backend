import * as rutinaModel from "../models/rutina.model";
import {
  insertar
} from "../models/rutina.model";


//users_id:number, descripcion:string, nombre:string, defecto:boolean, shared:boolean,frequent:boolean
export async function añadirRutina({users_id, descripcion, nombre, defecto,shared,frequent}:Rutina): Promise<number> {
  const result= await insertar(users_id,descripcion,nombre,defecto,shared,frequent);
  return result;
}