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
  nombreinst: string,
  dni: string,
  nombre: string,
  apellido: string
  ): Observable<Cliente[]>
  { return this.http.get(this.url + 'cliente/read.php?pinst_nombre='
   + nombreinst + '&pclt_dni=' + dni + '&pclt_nombre=' + nombre + '&pclt_apellido = + ' + apellido)
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'].clientes;
      }  else {
          console.log('Error al importar los datos, revisar servicio');
      }
    }));
  }

  Eliminar(
   producto: number
  ): Observable<any>
  {
    let params = 'idproducto=' + producto;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/delete.php', params, {headers: headers});
	}

  Agregar(
    id_institucion: number,
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
    var date = today.getFullYear() + '-' + (today.getMonth() + 1 ) + '-' + today.getDate();
    let params = 'id_institucion=' + id_institucion + '&clt_codigo=' + clt_codigo
    + '&clt_dni=' + clt_dni + '&clt_nombre=' + clt_nombre + '&clt_apellido=' + clt_apellido
    + '&clt_cip=' + clt_cip + '&clt_email=' + clt_email + '&clt_casilla=' + clt_casilla
    + '&clt_trabajo=' + clt_trabajo + '&clt_cargo=' + clt_cargo + '&clt_calificacion_crediticia=' + clt_calificacion_crediticia
    + '&clt_calificacion_personal=' + clt_calificacion_personal + '&clt_aporte=' + clt_aporte + '&clt_estado=1'
    + '&clt_fecharegistro=' + date;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cliente/create.php', params, {headers: headers});
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
