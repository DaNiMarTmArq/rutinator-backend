import * as rutinaModel from "../models/rutina.model";
import {
  insertar
} from "../models/rutina.model";

import {
  findByName
} from "../models/user.model";


//users_id:number, descripcion:string, nombre:string, defecto:boolean, shared:boolean,frequent:boolean
export async function añadirRutina(rutina:any): Promise<number> {
  const {
    usuario,
    descripcion,
    name,
    defecto,
    shared = false,
    frequent = false
  } = rutina;

  const result=0;
  const usu = await findByName(usuario);
  if (usu){
    const result= await insertar(usu.id,descripcion,name,defecto,shared,frequent);
 }
  return result;
}