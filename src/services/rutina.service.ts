import * as rutinaModel from "../models/rutina.model";
import {insertar,modificar} from "../models/rutina.model";
import {findByName} from "../models/user.model";
import {insertarVersion,comprobarVersion} from "../models/rutinaVersion.model";

export async function añadirRutina(rutina:any): Promise<number> {
  const {
    usuario,
    descripcion,
    name,
    defecto,
    shared = false,
    frequent = false
  } = rutina;

  let idRutVersion=0;
  const version = 1;
  const is_Selected = false;
  const usu = await findByName(usuario);
  if (usu){
    const idRutina= await insertar(usu.id,descripcion,name,defecto,shared,frequent);
    if (idRutina)
      idRutVersion= await insertarVersion(idRutina,version,is_Selected);
 }
  return idRutVersion;
}

export async function modificarRutina(rutina:any):Promise<number>{
  const {
    usuario,
    descripcion,
    name,
    defecto,
    shared = false,
    frequent = false,
    id_rutina
  } = rutina;

  let idRutVersion=0;
  //let version:number = 1;
  const is_Selected = false;
  const usu = await findByName(usuario);
  if (usu){
    const idRutina= await modificar(usu.id,id_rutina,descripcion,name,defecto,shared,frequent);
    if (idRutina){
      let version = await comprobarVersion(idRutina);
      version++;
      idRutVersion= await insertarVersion(idRutina,version,is_Selected);
      }
 }
  return idRutVersion;
}