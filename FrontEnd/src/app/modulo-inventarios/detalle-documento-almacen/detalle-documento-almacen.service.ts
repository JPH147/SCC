import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class  DetalleDocumentoAlmacenService {
  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  SeleccionarCabecera(
    id:number
  ): Observable<any> {
    return this.http.get(this.url + 'transaccioncabecera/readxId.php', {
      params: new HttpParams()
        .set('prid', id.toString())
      }).pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  EliminarDetalle(
    id_detalle : number ,
    id_serie : number
  ){
    let params = new HttpParams()
      .set('prid', id_detalle.toString())
      .set('prserie', id_serie.toString());
    
    return this.http.post(this.url + 'transacciondetalle/delete-compra.php', params )
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar',res);
        return false;
      }
    }));
  }

  ActualizarCabecera(
    id_transaccion : number ,
    proveedor : number ,
    fecha : Date ,
    documento : string ,
    archivo : string ,
  ){
    let params = new HttpParams()
      .set('prid', id_transaccion.toString())
      .set('prproveedor', proveedor.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prdocumento', documento)
      .set('prarchivo', archivo);
    
    return this.http.post(this.url + 'transaccioncabecera/update-compra.php', params )
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar',res);
        return false;
      }
    }));
  }

}
