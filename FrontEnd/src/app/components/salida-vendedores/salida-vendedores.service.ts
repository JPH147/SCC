import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class SalidaVendedoresService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  Agregar(
    pecosa: number,
    prsucursal: number,
    fecha: Date,
    destino:string,
    guia: string,
    movilidad:boolean
    ): Observable<any> {
    
    let TM:string;

  	if (movilidad) {
  		TM='1'
  	} else{
  		TM='0'
  	}

    let params = new HttpParams()
   				.set('prpecosa', pecosa.toString())
   				.set('prsucursal', prsucursal.toString())
   				.set('prfecha', moment(fecha).format("YYYY/MM/DD").toString())
   				.set('prdestino', destino)
   				.set('prguia', guia)
   				.set('prmovilidad', TM)
    
    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create.php', params, {headers: headers});
  }

}