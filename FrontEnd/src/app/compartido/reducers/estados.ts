import { usuario, Rol } from "../modelos/login.modelos";
import { ActionReducerMap } from "@ngrx/store";
import { EstablecerUsuario } from "./usuarios.reducer";
import { PermisosSesion } from "./permisos.reducer";

export interface EstadosGlobales {
  usuario : usuario ,
  permisos : Rol
} 

export const ReducersGlobales : ActionReducerMap<EstadosGlobales> = {
  usuario : EstablecerUsuario ,
  permisos : PermisosSesion
};