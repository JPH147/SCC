import { Action } from '@ngrx/store' ;
import { usuario } from 'src/app/compartido/modelos/login.modelos';

export const login = '[usuario] IniciarSesion' ;
export const logout = '[usuario] CerrarSesion' ;

export interface EstadoSesion {
  usuario : usuario
}

export function EstablecerUsuario( state : usuario = null, action : AccionesPermitidas ) {
  switch ( action.type ) {
    case login :
      state = action.asignar_usuario ;
      return state ;

    case logout :
      return null ;

    default :
      return null ;
  }
}

export class IniciarSesion implements Action {
  readonly type = login ;
  constructor( public asignar_usuario : usuario ) {}
}

export class CerrarSesion implements Action {
  readonly type = logout ;
}

type AccionesPermitidas = IniciarSesion | CerrarSesion ;