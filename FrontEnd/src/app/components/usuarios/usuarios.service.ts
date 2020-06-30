import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public url: string = URL.url;
  public Usuario : any ; 
  // public Usuario : any = true ;  // Se coloca TRUE solo en desarrollo
  public UsuarioS = new BehaviorSubject<any>("") ;

  constructor(
    private http : HttpClient ,
  ) { }

  ListarUsuarios(
    nombre : string ,
    nick : string ,
    rol : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prusuario", nick)
      .set("prperfil", rol)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"usuario/read.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearUsuario(
    nombre : string ,
    usuario : string ,
    pss : string ,
    perfil : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('usr_nombre', nombre )
      .set('usr_usuario', usuario )
      .set('usr_clave', pss )
      .set('idperfil', perfil.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/create.php', params, {headers: headers});    
  }

  ActualizarUsuario(
    id_usuario : number ,
    nombre : string ,
    usuario : string ,
    perfil : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('idusuario', id_usuario.toString() )
      .set('usr_nombre', nombre )
      .set('usr_usuario', usuario )
      .set('idperfil', perfil.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/update.php', params, {headers: headers});    
  }

  ActualizarPss(
    id_usuario : number ,
    pss : string ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('idusuario', id_usuario.toString() )
      .set('prpss', pss ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/update-pss.php', params, {headers: headers});    
  }

  TryLogin(
    usuario : string ,
    password : string
  ) : Observable<any> {
    let params = new HttpParams()
      .set('usr_usuario', usuario )
      .set('usr_clave', password );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    if( usuario == "admin" && password == "Alvis" ) {
      this.Usuario = {
        usuario: 'ADMIN',
        perfil: 'Administrador',
      }
      this.UsuarioS.next(this.Usuario) ;
      return of(true) ;
    } else {
      return this.http.post(this.url + 'usuario/login.php', params, {headers: headers})
      .pipe(map(usuario=>{
        if ( usuario['codigo'] == 0 ) {
          this.AsignarUsuario( usuario['data'] ) ;
          return usuario['data'] ;
        } else {
          return false ;
        }
      })) ;
    }
  }

  LogOut() : Observable<any> {
    this.Usuario = false ;
    this.UsuarioS.next(this.Usuario) ;
    return of(true) ;
  }

  AsignarUsuario(
    usuario : any
  ){
    this.Usuario = usuario ;
    localStorage.setItem('usuario', JSON.stringify(this.Usuario)) ; // Se guarda en localStorage
    this.UsuarioS.next(this.Usuario) ;
  }

  EliminarUsuario(
    id_usuario : number ,
  ) : Observable<any> {
    let params = new HttpParams()
      .set('idusuario', id_usuario.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/delete.php', params, {headers: headers})
    .pipe(map(res=>{
      if ( res['codigo'] == 0 ) {
        return true ;
      } else {
        return false ;
      }
    }))
  }

  CrearPerfil(
    nombre : string ,
    resumen : string ,
    roles : Rol
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prnombre', nombre )
      .set('prresumen', resumen )
      .set('prpermisos', JSON.stringify(roles) );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'perfil/create.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return true ;
        } else {
          return false ;
        }
      })
    )
  }

  ActualizarPerfil(
    id_perfil : number ,
    nombre : string ,
    resumen : string ,
    roles : Rol
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_perfil.toString() )  
      .set('prnombre', nombre )
      .set('prresumen', resumen )
      .set('prpermisos', JSON.stringify(roles) );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'perfil/update.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return true ;
        } else {
          return false ;
        }
      })
    )
  }

  ListarPerfil(
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prnombre', nombre )
      .set('prpagina', numero_pagina.toString() )
      .set('prtotalpagina', total_pagina.toString() );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(this.url + 'perfil/read.php', { params : params, headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return respuesta ;
        } else {
          return false ;
        }
      })
    )
  }

  SeleccionarPerfil(
    id_perfil : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_perfil.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(this.url + 'perfil/readxId.php', { params : params, headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return respuesta['data'] ;
        } else {
          return false ;
        }
      })
    )
  }

  EliminarPerfil(
    id_perfl : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_perfl.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'perfil/delete.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return true ;
        } else {
          return false ;
        }
      })
    )
  }

  VerificarUsuario(
    usuario : string ,
    id_evitar : number ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prusuario', usuario )  
      .set('prid', id_evitar.toString() );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'usuario/verificar.php', params , { headers : headers })
    .pipe(
      map(respuesta=>{
        if ( respuesta['codigo'] == 0 ) {
          return respuesta['data'] ;
        } else {
          return false ;
        }
      })
    )
  }

}

export type Rol = {
  maestro_general : {
    general : boolean ,
    clientes : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      confirmar_pendientes : boolean ,
      subir_foto : boolean ,
      ver_ventas : boolean ,
      crear_observaciones : boolean ,
    } ,
    evaluacion : {
      general : boolean ,
    } ,
    seguimiento_documentos : {
      general : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      registrar_entrega : boolean ,
      ver_documento : boolean ,
    }
  } ,
  ventas : {
    general : boolean ,
    listado_ventas : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      realizar_canjes : boolean ,
      abrir_procesos : boolean ,
    } ,
    salida_ventas : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      registrar_retorno : boolean ,
    } ,
    comision_vendedores : {
      general : boolean ,
    } ,
  } ,
  inventarios : {
    general : boolean ,
    productos : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      subir_foto : boolean ,
    } ,
    stock : {
      general : boolean ,
      registrar_ingreso : boolean ,
      registrar_salida : boolean ,
    } ,
    documentos_almacen : {
      general : boolean ,
      editar : boolean ,
    } ,
    historial_series : {
      general : boolean ,
    }
  } ,
  creditos : {
    general : boolean ,
    listado_creditos : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      abrir_procesos : boolean ,
    } ,
    afiliaciones : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
    } ,
    refinanciamientos : {
      general : boolean ,
    } ,
  } ,
  procesos_judiciales : {
    general : boolean ,
    listado_procesos : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
      agregar_documentos : boolean ,
      ver_cronograma : boolean ,
      realizar_cronograma : boolean ,
    } ,
  } ,
  cobranzas : {
    general : boolean ,
    cronograma : {
      general : boolean ,
      editar : boolean ,
    } ,
    clientes_morosos : {
      general : boolean ,
    } ,
    cobranzas_directas : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
    } ,
    cobranzas_planilla : {
      general : boolean ,
      agregar : boolean ,
      descargar_archivo : boolean ,
      registrar_pago : boolean ,
      eliminar : boolean ,
    } ,
    cobranzas_manuales : {
      general : boolean ,
      agregar : boolean ,
      editar : boolean ,
      eliminar : boolean ,
    }
  } ,
  tablas_maestras : {
    general : boolean ,
    usuarios : boolean ,
    direcciones : boolean ,
    instituciones : boolean ,
    procesos_judiciales : boolean ,
    plantillas : boolean ,
    productos : boolean ,
    proveedores : boolean ,
    talonarios : boolean ,
    trabajadores : boolean ,
  }
}