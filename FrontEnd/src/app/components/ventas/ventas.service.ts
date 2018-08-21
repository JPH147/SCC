import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class VentaService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  GenerarCronograma(
    fechainicio: string,
    monto: any,
    numerocuotas: number,
    montoinicial: number
  ): Observable<Venta[]> {
    return this.http.get(this.url + 'cronograma/create.php?fechainicio=' +
    fechainicio + '&monto=' + monto + '&numerocuotas=' + numerocuotas + '&montoinicial=' + montoinicial)
    .pipe(map(res => {
      console.log(res);
      if (res['codigo'] === 0) {
          return res['data'].cuotas;
      }  else {
          console.log('Error al importar los datos, revisar servicio');
      }
    }));
  }

  CrearVenta(pid_talonario: number,
    pid_cliente: number,
    pvnt_fecha: Date,
    pid_vendedor: number,
    pvnt_fecha_inicio: Date,
    pvnt_inicial: number,
    pvnt_numero_cuota: number,
    pid_tipopago: number,
    pvnt_total: number,
    pvnt_tipoventa: number,
    pvnt_lugarventa: string,
    pvnt_observaciones: string
  ): Observable<any> {

    let params = 'pid_talonario=' + pid_talonario + '&pid_cliente=' + pid_cliente
    + '&pvnt_fecha=' +  moment(pvnt_fecha).format('YYYY/MM/DD').toString()
    + '&pid_vendedor=' + pid_vendedor + '&pvnt_fecha_inicio=' + moment(pvnt_fecha_inicio).format('YYYY/MM/DD').toString()
    + '&pvnt_inicial=' + pvnt_inicial + '&pvnt_numero_cuota=' + pvnt_numero_cuota
    + '&pid_tipopago=' + pid_tipopago + '&pvnt_total=' + pvnt_total + '&pvnt_tipoventa=' + pvnt_tipoventa
    + '&pvnt_lugarventa=' + pvnt_lugarventa + '&pvnt_observaciones=' + pvnt_observaciones;
    // tslint:disable-next-line:prefer-const

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    console.log(params);
    return this.http.post(this.url + 'venta/create.php', params, {headers: headers});
  }
}

export interface Venta {
  numero: number;
  month: string;
  price: number;
}
