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
  institucion: string,
  sede: string,
  subsede: string,
  cargo:string,
  codigo:string,
  dni: string,
  nombre: string,
  prpagina: number,
  prtotalpagina: number
  ): Observable<any>  {
     return this.http.get(this.url + 'cliente/read.php',{
       params: new HttpParams()
       .set('prinstitucion', institucion)
       .set('prsede',sede)
       .set('prsubsede',subsede)
       .set('prcargo',cargo)
       .set('prcodigo',codigo)
       .set('prdni',dni)
       .set('prnombre',nombre)
       .set('prpagina',prpagina.toString())
       .set('prtotalpagina',prtotalpagina.toString())
     }).pipe(map(res => {
      if (res['codigo'] === 0) {
        res['data'].clientes.forEach((item)=>{
          item.foto= URLIMAGENES.urlimages + 'cliente/' + item.foto;
        })
        return res;
      }else {
        console.log('Error al importar los datos, revisar servicio');
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
        console.log('Error al importar los datos, revisar servicio');
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
    id_subsede: number,
    clt_codigo: string,
    clt_dni: string,
    clt_nombre: string,
    clt_cip: string,
    clt_email: string,
    clt_casilla: string,
    clt_trabajo: string,
    clt_cargo: string,
    clt_calificacion_crediticia: string,
    clt_calificacion_personal: string,
    clt_aporte: number
    ): Observable<any> {

    // let params = 'id_subsede=' + id_subsede + '&clt_codigo=' + clt_codigo
    // + '&clt_dni=' + clt_dni + '&clt_nombre=' + clt_nombre
    // + '&clt_cip=' + clt_cip + '&clt_email=' + clt_email + '&clt_casilla=' + clt_casilla
    // + '&clt_trabajo=' + clt_trabajo + '&clt_cargo=' + clt_cargo + '&clt_calificacion_crediticia=' + clt_calificacion_crediticia
    // + '&clt_calificacion_personal=' + clt_calificacion_personal + '&clt_aporte=' + clt_aporte + '&clt_estado=1'
    // + '&clt_fecharegistro=' + date;

    let params = new HttpParams()
    .set('id_subsede', id_subsede.toString())
    .set('clt_codigo', clt_codigo)
    .set('clt_dni', clt_dni)
    .set('clt_nombre', clt_nombre)
    .set('clt_cip', clt_cip)
    .set('clt_email', clt_email)
    .set('clt_casilla', clt_casilla)
    .set('clt_trabajo', clt_trabajo)
    .set('clt_cargo',clt_cargo)
    .set('clt_calificacion_crediticia',clt_calificacion_crediticia)
    .set('clt_calificacion_personal',clt_calificacion_personal)
    .set('clt_aporte',clt_aporte.toString())
    .set('clt_fecharegistro', moment(new Date()).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/create.php', params, {headers: headers});
  }

  Actualizar(
    idcliente: number,
    id_subsede: number,
    clt_codigo: string,
    clt_dni: string,
    clt_nombre: string,
    clt_cip: string,
    clt_email: string,
    clt_casilla: string,
    clt_trabajo: string,
    clt_cargo: string,
    clt_calificacion_crediticia: string,
    clt_calificacion_personal: string,
    clt_aporte: number
  ): Observable<any> {

    let params = new HttpParams()
    .set('idcliente', idcliente.toString())
    .set('id_subsede', id_subsede.toString())
    .set('clt_codigo', clt_codigo)
    .set('clt_dni', clt_dni)
    .set('clt_nombre', clt_nombre)
    .set('clt_cip', clt_cip)
    .set('clt_email', clt_email)
    .set('clt_casilla', clt_casilla)
    .set('clt_trabajo', clt_trabajo)
    .set('clt_cargo',clt_cargo)
    .set('clt_calificacion_crediticia',clt_calificacion_crediticia)
    .set('clt_calificacion_personal',clt_calificacion_personal)
    .set('clt_aporte',clt_aporte.toString())
    
    console.log(params);
    
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
     console.log(res);
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
      }  else {
          console.log('Error al importar los datos, revisar servicio');
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
