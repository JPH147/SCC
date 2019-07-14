import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL,URLIMAGENES} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class ClienteService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
  // institucion: string,
  // sede: string,
  // subsede: string,
  // cargo:string,
  codigo:string,
  dni: string,
  nombre: string,
  prpagina: number,
  prtotalpagina: number
  ): Observable<any>  {
     return this.http.get(this.url + 'cliente/read.php',{
       params: new HttpParams()
      //  .set('prinstitucion', institucion)
      //  .set('prsede',sede)
      //  .set('prsubsede',subsede)
      //  .set('prcargo',cargo)
       .set('prcodigo',codigo)
       .set('prdni',dni)
       .set('prnombre',nombre)
       .set('prpagina',prpagina.toString())
       .set('prtotalpagina',prtotalpagina.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        res['data'].clientes.forEach((item)=>{
          item.foto= URLIMAGENES.carpeta + 'cliente/' + item.foto;
        })
        return res;
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  BuscarCliente(
    dni:string,
    nombre:string
  ): Observable<any> {
     return this.http.get(this.url + 'cliente/readpreciso.php',{
       params: new HttpParams()
       .set('prdni',dni)
       .set('prnombre',nombre)
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].clientes;
      } else {
        // console.log('No hay datos que mostrar');
      }
    }));
  }

  Eliminar(
   idcliente: number
  ): Observable<any>  {

    let params = 'idcliente=' + idcliente;

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/delete.php', params, {headers: headers});
	  }

  Agregar(
    id_subsede:number,
    cargo_estado: number,
    clt_codigo: string,
    clt_dni: string,
    clt_nombre: string,
    clt_cip: string,
    clt_email: string,
    clt_casilla: string,
    id_distrito:number,
    clt_trabajo: string,
    capacidad_pago: number,
    maximo_descuento: number,
    clt_calificacion_personal: string,
    clt_aporte: number
  ): Observable<any> {

    let params = new HttpParams()
    .set('prsubsede', id_subsede.toString())
    .set('prcargoestado', cargo_estado.toString())
    .set('clt_codigo', clt_codigo)
    .set('clt_dni', clt_dni)
    .set('clt_nombre', clt_nombre)
    .set('clt_cip', clt_cip)
    .set('clt_email', clt_email)
    .set('clt_casilla', clt_casilla)
    .set('clt_trabajo', clt_trabajo)
    .set('prdistrito', id_distrito.toString())
    .set('prapacidadpago',capacidad_pago.toString())
    .set('prmaximodescuento',maximo_descuento.toString())
    .set('clt_calificacion_personal',clt_calificacion_personal)
    .set('clt_aporte',clt_aporte.toString())
    .set('clt_fecharegistro', moment(new Date()).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/create.php', params, {headers: headers});
  }

  Actualizar(
    idcliente: number,
    id_subsede: number,
    cargo_estado: number,
    clt_codigo: string,
    clt_dni: string,
    clt_nombre: string,
    clt_cip: string,
    clt_email: string,
    clt_casilla: string,
    id_distrito: number,
    clt_trabajo: string,
    capacidad_pago: number,
    maximo_descuento: number,
    clt_calificacion_personal: string,
    clt_aporte: number
  ): Observable<any> {

    let params = new HttpParams()
    .set('idcliente', idcliente.toString())
    .set('id_subsede', id_subsede.toString())
    .set('prcargoestado', cargo_estado.toString())
    .set('clt_codigo', clt_codigo)
    .set('clt_dni', clt_dni)
    .set('clt_nombre', clt_nombre)
    .set('clt_cip', clt_cip)
    .set('clt_email', clt_email)
    .set('clt_casilla', clt_casilla)
    .set('clt_trabajo', clt_trabajo)
    .set('prdistritotrabajo',id_distrito.toString())
    .set('prcapacidadpago', capacidad_pago.toString())
    .set('prmaximodescuento', maximo_descuento.toString())
    .set('clt_calificacion_personal',clt_calificacion_personal)
    .set('clt_aporte',clt_aporte.toString())
    
    // console.log(params);
    
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/update.php', params, {headers: headers});
  }

  ActualizarFoto(idcliente: number,
  clt_foto: string): Observable<any> {
    let params = new HttpParams()
    .set('idcliente', idcliente.toString())
    .set('clt_foto', clt_foto);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/updateimage.php', params, {headers: headers}).pipe(map(res => {
      return res;
    }));
  }

  Seleccionar(
    id: number
  // tslint:disable-next-line:whitespace
  ):Observable<Cliente> {
    return this.http.get(this.url + 'cliente/readxId.php?idcliente=' + id)
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'];
      } else {
        // console.log(res)
        console.log('No hay datos que mostrar');
      }
    }));
  }

  /******************************************/

  CrearCuenta(
    cliente:number,
    banco:number,
    cuenta:string,
    cci:string,
  ){
    let params = new HttpParams()
    .set('prcliente', cliente.toString())
    .set('prbanco', banco.toString())
    .set('prcuenta', cuenta)
    .set('prcci', cci)
    // console.log(params)
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clientecuenta/create.php', params, {headers: headers});
  }

  ListarCuenta(
    id_cliente:number,
    relevancia:string,
    prpagina: number,
    prtotalpagina: number
  ){
    return this.http.get(this.url + 'clientecuenta/read.php',{
       params: new HttpParams()
       .set('prcliente', id_cliente.toString())
       .set('prrelevancia', relevancia)
       .set('prpagina',prpagina.toString())
       .set('prtotalpagina',prtotalpagina.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }else {
        // console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  EliminarCuenta(
    id_cuenta:number
  ){
    let params = new HttpParams()
    .set('prid', id_cuenta.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clientecuenta/delete.php', params, {headers: headers});
  }

  EstablecerCuenta(
    id_cuenta:number
  ){
    let params = new HttpParams()
    .set('prcuenta', id_cuenta.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clientecuenta/actualizar-primario.php', params, {headers: headers});
  }

  CrearObservacion(
    cliente:number,
    observacion:string,
    fecha: Date
  ){
    let params = new HttpParams()
    .set('prcliente', cliente.toString())
    .set('probservacion', observacion)
    .set('prfecha', moment(fecha).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clienteobservacion/create.php', params, {headers: headers});
  }

  ListarObservacion(
    id_observacion:number,
    pagina_inicio:number,
    total_pagina:number
  ){
    return this.http.get(this.url + 'clienteobservacion/read.php',{
       params: new HttpParams()
       .set('prcliente', id_observacion.toString())
       .set('prpagina', pagina_inicio.toString())
       .set('prtotalpagina', total_pagina.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  EliminarObservacion(
    id_observacion:number
  ){
    let params = new HttpParams()
    .set('prid', id_observacion.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clienteobservacion/delete.php', params, {headers: headers});
  }

  /**********************************/

  ListarCargo(
    id_sede:number
  ){
    return this.http.get(this.url + 'cargo/read-cargo.php',{
       params: new HttpParams()
       .set('prsede', id_sede.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarCargoEstado(
    id_cargo:number
  ){
    return this.http.get(this.url + 'cargo/read-cargo-estado.php',{
       params: new HttpParams()
       .set('prcargo', id_cargo.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  BuscarClienteDNI(
    dni : string
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prdni', dni)
    return this.http.get(this.url + 'cliente/buscar.php',{params})
    .pipe(map(res => {
     if (res['codigo'] === 0) {
       return res;
     }else {
       console.log('No hay datos que mostrar');
       return res;
     }
   }));
  }

  BuscarCelular(
    id: number
  ): Observable <any> {
    let params = new HttpParams()
      .set('prcliente', id.toString());

    return this.http.get(this.url + 'clientetelefono/buscar-celular.php',{params})
    .pipe(map(res => {
     if (res['codigo'] === 0) {
       return res['data'];
     }else {
       console.log('No hay datos que mostrar');
       return res;
     }
   }));
  }
}

export interface Cliente {
  id: number;
  numero: number;
  institucion: string;
  codigo: string;
  dni: string;
  nombre: string;
  cip: string;
  email: string;
  casilla: string;
  trabajo: string;
  cargo: string;
  calificacioncrediticia: string;
  calificacionpersonal: string;
  aporte: number;
  foto: string;
}


