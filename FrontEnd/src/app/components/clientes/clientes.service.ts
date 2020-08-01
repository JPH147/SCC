import {Injectable, Optional} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL,URLIMAGENES} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
    codigo:string ,
    cip:string ,
    dni: string ,
    nombre: string ,
    institucion: number ,
    sede: number ,
    prpagina: number ,
    prtotalpagina: number ,
    estado : number ,
    tiempo : number
  ): Observable<any>  {
     return this.http.get(this.url + 'cliente/read.php',{
       params: new HttpParams()
       .set('prcodigo',codigo)
       .set('prcip',cip)
       .set('prdni',dni)
       .set('prnombre',nombre)
       .set('prinstitucion',institucion.toString() )
       .set('prsede',sede.toString() )
       .set('prpagina',prpagina.toString())
       .set('prtotalpagina',prtotalpagina.toString())
       .set('prestado', estado.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        res['data'].clientes = res['data'].clientes.map(item=>{
                                item.foto = URLIMAGENES.carpeta + 'cliente/' + item.foto;
                                item.dni = item.dni.substring(1,item.dni.length);
                                item.codigo = item.codigo.substring(1,item.codigo.length);
                                item.cip = item.cip.substring(1,item.cip.length);
                                return item;
                              })
        res['tiempo'] = tiempo ;
        return res;
      }else {
        console.log('No hay datos que mostrar', res);
        res['tiempo'] = tiempo ;
        return res;
      }
    }));
  }

  ListadoComercial(
    codigo:string ,
    cip:string ,
    dni: string ,
    nombre: string ,
    institucion: number ,
    sede: number ,
    prpagina: number,
    prtotalpagina: number,
    estado : number
  ): Observable<any>  {
     return this.http.get(this.url + 'cliente/read-comercial.php',{
       params: new HttpParams()
       .set('prcodigo',codigo)
       .set('prcip',cip)
       .set('prdni',dni)
       .set('prnombre',nombre)
       .set('prinstitucion',institucion.toString() )
       .set('prsede',sede.toString() )
       .set('prpagina',prpagina.toString())
       .set('prtotalpagina',prtotalpagina.toString())
       .set('prestado', estado.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        res['data'].clientes = res['data'].clientes.map(item=>{
                                item.foto = URLIMAGENES.carpeta + 'cliente/' + item.foto;
                                item.dni = item.dni.substring(1,item.dni.length);
                                item.codigo = item.codigo.substring(1,item.codigo.length);
                                return item;
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
    cargo: number,
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
    clt_aporte: number,
    estado: number,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prsubsede', id_subsede.toString())
      .set('prcargo', cargo.toString())
      .set('prcargoestado', cargo_estado.toString())
      .set('clt_codigo', clt_codigo)
      .set('clt_dni', clt_dni)
      .set('clt_nombre', clt_nombre)
      .set('clt_cip', clt_cip)
      .set('clt_email', clt_email)
      .set('clt_casilla', clt_casilla)
      .set('prdistrito', id_distrito ? id_distrito.toString() : "0" )
      .set('clt_trabajo', clt_trabajo)
      .set('prapacidadpago', capacidad_pago.toString() )
      .set('prmaximodescuento', maximo_descuento.toString() )
      .set('clt_calificacion_personal',clt_calificacion_personal)
      .set('clt_aporte',clt_aporte.toString())
      .set('clt_fecharegistro', moment(new Date()).format("YYYY-MM-DD"))
      .set('prestado',estado.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/create.php', params, {headers: headers})
    .pipe(
      map(res=>{
      console.log(params, res)
      return res;
    }));
  }

  Actualizar(
    idcliente: number,
    id_subsede: number,
    cargo: number,
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
    clt_aporte: number,
    estado : number
  ): Observable<any> {

    let params = new HttpParams()
    .set('idcliente', idcliente.toString())
    .set('id_subsede', id_subsede.toString())
    .set('prcargo', cargo.toString())
    .set('prcargoestado', cargo_estado.toString())
    .set('clt_codigo', clt_codigo)
    .set('clt_dni', clt_dni)
    .set('clt_nombre', clt_nombre)
    .set('clt_cip', clt_cip)
    .set('clt_email', clt_email)
    .set('clt_casilla', clt_casilla)
    .set('clt_trabajo', clt_trabajo)
    .set('prdistritotrabajo',id_distrito ? id_distrito.toString() : "0")
    .set('prcapacidadpago', capacidad_pago.toString())
    .set('prmaximodescuento', maximo_descuento.toString())
    .set('clt_calificacion_personal',clt_calificacion_personal)
    .set('clt_aporte',clt_aporte.toString())
    .set('prestado',estado.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/update.php', params, {headers: headers});
  }

  ActualizarParcial(
    idcliente: number,
    id_subsede: number,
    cargo: number,
    cargo_estado: number,
    clt_codigo: string,
    clt_dni: string,
    clt_nombre: string,
    clt_cip: string,
    clt_email: string,
    clt_casilla: string
  ): Observable<any> {

    let params = new HttpParams()
      .set('idcliente', idcliente.toString())
      .set('id_subsede', id_subsede.toString())
      .set('prcargo', cargo.toString())
      .set('prcargoestado', cargo_estado.toString())
      .set('clt_codigo', clt_codigo)
      .set('clt_dni', clt_dni)
      .set('clt_nombre', clt_nombre)
      .set('clt_cip', clt_cip)
      .set('clt_email', clt_email)
      .set('clt_casilla', clt_casilla) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/update-parcial.php', params, {headers: headers});
  }

  ActualizarFoto(
    idcliente: number,
    clt_foto: string
  ): Observable<any> {
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
  ):Observable<any> {
    return this.http.get(this.url + 'cliente/readxId.php?idcliente=' + id)
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        res['data']['dni'] = res['data']['dni'].substring(1,res['data']['dni'].length);
        res['data']['codigo'] = res['data']['codigo'].substring(1,res['data']['codigo'].length);
        return res['data'] ;
      } else {
        console.log('No hay datos que mostrar', res);
      }
    }));
  }

  EliminarPendientes(
  ) : Observable<any> {
    let params = new HttpParams() ;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') ;
    return this.http.post(this.url + 'cliente/delete-pendientes.php', params, { headers : headers } )
    .pipe(map(res=>{
      if( res['codigo']===0 ) {
        return true ;
      } else {
        return false ;
      }
    }))
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

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clientecuenta/create.php', params, {headers: headers});
  }

  ActualizarCuenta(
    id_cuenta:number,
    banco:number,
    cuenta:string,
    cci:string,
  ){
    let params = new HttpParams()
      .set('prid', id_cuenta.toString())
      .set('prbanco', banco.toString())
      .set('prcuenta', cuenta)
      .set('prcci', cci)

    console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clientecuenta/update.php', params, {headers: headers})
    .pipe(map(res=>{
      console.log(res)
      if( res['codigo'] == 0 ) {
        return true ;
      } else {
        return false ;
      }
    }));
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
    fecha: Date,
    observacion:string,
    nombre_archivo : string ,
  ){
    let params = new HttpParams()
    .set('prcliente', cliente.toString())
    .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
    .set('probservacion', observacion)
    .set('prarchivo', nombre_archivo) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'clienteobservacion/create.php', params, {headers: headers})
    .pipe(map(res=>{
      if( res['codigo']===0 ) {
        return true ;
      } else {
        return false ;
      }
    }))
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

  ListarLlamadas(
    id_cliente:number,
  ) :Observable<any> {
    return this.http.get(this.url + 'cliente/llamadas.php',{
       params: new HttpParams()
       .set('prid', id_cliente.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  EliminarArchivo(
    nombre_archivo:string,
  ) :Observable<boolean> {
    let params = new HttpParams()
      .set('prarchivo', nombre_archivo) ;

    return this.http.post(this.url + 'cliente/eliminar-llamada.php',params).pipe(map(res => {
      console.log(res) ;
      if (res['codigo'] === 0) {
        return res['data'];
      }else {
        console.log('No hay datos que mostrar');
        return false;
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
    id_sede:number
  ){
    return this.http.get(this.url + 'cargo/read-cargo-estado.php',{
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
      //  console.log('No hay datos que mostrar');
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
       return false;
     }
   }));
  }

  ListarClientesUnlimited(
    archivo:string,
    codigo:string,
    cip:string,
    dni: string,
    nombre: string,
    institucion: string,
    sede: string,
    estado : number
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prarchivo',archivo)
      .set('prcodigo',codigo)
      .set('prcip',cip)
      .set('prdni',dni)
      .set('prnombre',nombre)
      .set('prinstitucion',institucion.toString() )
      .set('prsede',sede.toString() )
      .set('prestado', estado.toString())

    return this.http.get(this.url + 'cliente/read-comercial-unlimited.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar', res);
        return false;
      }
    }));
  }
  
  VerificarPagosCliente(
    id_cliente:number
  ){
    let params = new HttpParams()
    .set('idcliente', id_cliente.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/verificar-pagos.php', params, {headers: headers});
  }
}
