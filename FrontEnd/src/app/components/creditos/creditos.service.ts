import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class CreditosService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient
  ) { }

  Listar(
    cliente:string,
    tipo_credito:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
    orden:string
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',cliente)
      .set('prtipo_credito',tipo_credito.toString())
      .set('prfecha_inicio',moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfecha_fin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString())
      .set('prpagina',pagina_inicio.toString())
      .set('prtotalpagina',pagina_final.toString())
      .set('prorden',orden)

    console.log(params);

    return this.http.get(this.url + 'credito/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

}
