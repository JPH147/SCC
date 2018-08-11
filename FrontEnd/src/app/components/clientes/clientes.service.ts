import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';

@Injectable()

export class ClienteService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
  inst_nombre: string,
  sd_nombre: string,
  ssd_nombre: string,
  dni: string,
  nombre: string,
  apellido: string
  ): Observable<Cliente[]>  {
     return this.http.get(this.url + 'cliente/read.php?inst_nombre='
   + inst_nombre + '&sd_nombre=' + sd_nombre + '&ssd_nombre='
   + ssd_nombre + '&pclt_dni=' + dni + '&pclt_nombre=' + nombre + '&pclt_apellido=' + apellido)
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'].clientes;
      }  else {
          console.log('Error al importar los datos, revisar servicio');
      }
    }));
  }

  Eliminar(
   idcliente: number
  ): Observable<any>  {
    // tslint:disable-next-line:prefer-const
    let params = 'idcliente=' + idcliente;
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/delete.php', params, {headers: headers});
   // tslint:disable-next-line:indent
	  }

  Agregar(
    id_subsede: number,
    clt_codigo: string,
    clt_dni: string,
    clt_nombre: string,
    clt_apellido: string,
    clt_cip: string,
    clt_email: string,
    clt_casilla: string,
    clt_trabajo: string,
    clt_cargo: string,
    clt_calificacion_crediticia: string,
    clt_calificacion_personal: string,
    clt_aporte: number
    ): Observable<any> {

    var today = new Date();
    // tslint:disable-next-line:no-var-keyword
    // tslint:disable-next-line:prefer-const
    let date = today.getFullYear() + '-' + (today.getMonth() + 1 ) + '-' + today.getDate();
    // tslint:disable-next-line:prefer-const
    let params = 'id_subsede=' + id_subsede + '&clt_codigo=' + clt_codigo
    + '&clt_dni=' + clt_dni + '&clt_nombre=' + clt_nombre + '&clt_apellido=' + clt_apellido
    + '&clt_cip=' + clt_cip + '&clt_email=' + clt_email + '&clt_casilla=' + clt_casilla
    + '&clt_trabajo=' + clt_trabajo + '&clt_cargo=' + clt_cargo + '&clt_calificacion_crediticia=' + clt_calificacion_crediticia
    + '&clt_calificacion_personal=' + clt_calificacion_personal + '&clt_aporte=' + clt_aporte + '&clt_estado=1'
    + '&clt_fecharegistro=' + date;
    // tslint:disable-next-line:prefer-const
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/create.php', params, {headers: headers});
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
  nombrecliente: string;
  apellidocliente: string;
  cip: string;
  email: string;
  casilla: string;
  trabajo: string;
  cargo: string;
  calificacioncrediticia: string;
  calificacionpersonal: string;
  aporte: number;
}
