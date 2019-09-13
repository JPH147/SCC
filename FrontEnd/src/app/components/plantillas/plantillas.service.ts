import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL, URLIMAGENES} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PlantillasService {

  public url: string = URL.url;
  public url_imagenes: string = URLIMAGENES.urlimages;

  constructor(
    private http: HttpClient
  ) { }

  ObtenerArchivo(
    nombre:string
  ): Observable<Blob>{

    let params = new HttpParams()
    .set('prarchivo', nombre)

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

    return this.http.post(this.url + 'plantillas/descargar-plantilla.php', params, {
      responseType: "blob"
    });
  }

  SubirArchivo(
    file : File
  ){
    let testData:FormData = new FormData();
    testData.append('image', file, file.name);
    // console.log(testData);
    return this.http.post(this.url_imagenes, testData);
  }

  RenameFile(
    nameimg: string,
    nombre: string,
  ): Observable <any> {

    if (!nameimg) {
      return of({codigo:1, data:"",mensaje:""});
    }

    return this.http.get(this.url + 'plantillas/actualizar-plantilla.php', {
    params: new  HttpParams()
      .set('nameimg', nameimg.trim())
      .set('tipodoc', nombre.trim())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log ('No hay datos que mostrar');
        return [];
      }
    }));
  }

}
