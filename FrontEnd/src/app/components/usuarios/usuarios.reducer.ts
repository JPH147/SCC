import { Action } from '@ngrx/store' ;
import { Rol } from './usuarios.service';

export const login = '[usuario] LOGIN' ;
export const logout = '[usuario] LOGOUT' ;

export interface EstadoSesion {
  permisos : Rol
}

export function PermisosSesion( state : Rol = null, action : AccionesPermitidas ) {
  switch ( action.type ) {
    case login :
      state = action.permisos_asignados ;
      return state ;

    case logout :
      return null ;

    default :
      return null ;
  }
}

export class AsignarPermisos implements Action {
  readonly type = login ;
  constructor( public permisos_asignados : Rol ) {}
}

export class RemoverPermisos implements Action {
  readonly type = logout ;
}

type AccionesPermitidas = AsignarPermisos | RemoverPermisos ;