import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';

@Injectable()

export class VentaService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
    fechainicio: Date,
    monto: number,
    numerocuotas: number
  ): Observable<Venta[]>
{ return this.http.get(this.url + 'cronograma/create.php?fechainicio='
   + fechainicio + '&monto=' + monto + '&numerocuotas=' + numerocuotas)
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'].cuotas;
      }  else {
          console.log('Error al importar los datos, revisar servicio');
      }
    }));
  }
}

export interface Venta {
  numero: number;
  fechapago: Date;
  monto: number;
}
