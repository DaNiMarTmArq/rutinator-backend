import * as rutinaModel from "../models/rutina.model";
import {
  insertar
} from "../models/rutina.model";


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
  console.log("el valor de usuario es:",name);
  const result= await insertar(usuario,descripcion,name,defecto,shared,frequent);
  return result;
}