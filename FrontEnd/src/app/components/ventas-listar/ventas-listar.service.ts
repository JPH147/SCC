import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';
 
@Injectable()

export class VentasServicio {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Listado(
    cliente:string,
    tipo_venta:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
    orden:string
  ): Observable<any> {

    let Tipo:string, Finicio: string ,Ffin: string, Orden:string;

    if (!fecha_inicio) {
      Finicio=""
    }else{
      Finicio=moment(fecha_inicio,"DD/MM/YYYY").format("YYYY/MM/DD").toString()
    }

    if (!fecha_fin) {
      Ffin=""
    }else{
      Ffin=moment(fecha_fin,"DD/MM/YYYY").format("YYYY/MM/DD").toString()
    }

    if (tipo_venta == null) {
      Tipo=""
    }else{
      Tipo=tipo_venta.toString()
    }

    return this.http.get(this.url + 'venta/read.php', {
      params: new HttpParams()
      .set('prcliente',cliente)
      .set('prtipo_venta',Tipo)
      .set('prfecha_inicio',Finicio)
      .set('prfecha_fin',Ffin)
      .set('prestado',estado.toString())
      .set('prpagina',pagina_inicio.toString())
      .set('prtotalpagina',pagina_final.toString())
      .set('prorden',orden)
  })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

  // Seleccionar(
  //   id: number
  // ): Observable<Producto> {
  //   return this.http.get(this.url + 'producto/readxId.php?id_producto=' + id)
  //   .pipe(map(res => {
  //     if (res['codigo'] === 0) {
  //         return res['data'];
  //     }  else {
  //         console.log('No hay datos que mostrar');
  //     }
  //   }));
  // }

}