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
  apellido: string,
  aporteinicio: number,
  aportefin: number
  ): Observable<Cliente[]>
  { return this.http.get(this.url + 'cliente/read.php?pinst_nombre='
   + nombreinst + '&clt_dni=' + dni + '&clt_nombre=' + nombre + '&clt_apellido = + ' + apellido + '&clt_aporteinicio = +'
   + aporteinicio + '&clt_aportefin = + ' + aportefin)
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
    modelo: number,
    descripcion: string
    ): Observable<any> {
    let params = 'id_modelo=' + modelo + '&prd_descripcion=' + descripcion;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'producto/create.php', params, {headers: headers});
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
  //fecharegistro: date;
}

export interface Maestro {
  id_modelo: number;
  prd_descripcion: string;
  }
