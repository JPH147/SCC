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

  ListarTipos(): Observable<any> {
    return this.http.get(this.url + 'plantillas/read-tipo.php')
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'] ;
      } else {
        return [] ;
      }
    }));
  }

  CrearPlantilla(
    tipo_plantilla : number ,
    fecha : Date ,
    usuario : number ,
    comentarios : string ,
    archivos : string ,
   ): Observable<boolean>  {
     let params = new HttpParams()
      .set( "prtipoplantilla" , tipo_plantilla.toString() )
      .set( "fecha" , moment(fecha).format("YYYY-MM-DD") )
      .set( "prusuario" , usuario.toString() )
      .set( "prcomentarios" , comentarios )
      .set( "prarchivos" , archivos ) ;
 
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'plantillas/crear-plantilla.php', params, {headers: headers})
    .pipe(
      map((res=>{
        if ( res['codigo'] === 0 ) {
          return true ;
        } else {
          console.log(res) ;
          return false ;
        }
      }))
    );
  }

  ListarPlantillas(
    tipo : number ,
    relevancia : number ,
    usuario : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ): Observable<any> {
    let params = new HttpParams()
      .set( "prtipo", tipo.toString() )
      .set( "prrelevancia", relevancia.toString() )
      .set( "prusuario", usuario )
      .set( "prpagina", numero_pagina.toString() )
      .set( "prtotalpagina", total_pagina.toString() ) ;

    return this.http.get(this.url + 'plantillas/read.php', { params } )
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res ;
      } else {
        return false ;
      }
    }));
  }

  EliminarPlantilla(
    id_plantilla : number ,
  ): Observable<boolean>  {
    let params = new HttpParams()
      .set( "prplantilla" , id_plantilla.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    
    return this.http.post(this.url + 'plantillas/eliminar-plantilla.php', params, {headers: headers})
    .pipe(
      map((res=>{
        if ( res['codigo'] === 0 ) {
          return true ;
        } else {
          console.log(res) ;
          return false ;
        }
      }))
    );
  }
  
  ActualizarPlantillaRelevancia(
    id_plantilla : number ,
    tipo_plantilla : number ,
  ): Observable<boolean>  {
    let params = new HttpParams()
      .set( "prplantilla" , id_plantilla.toString() )
      .set( "prtipo" , tipo_plantilla.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    
    return this.http.post(this.url + 'plantillas/actualizar-plantilla-relevancia.php', params, {headers: headers})
    .pipe(
      map((res=>{
        if ( res['codigo'] === 0 ) {
          return true ;
        } else {
          console.log(res) ;
          return false ;
        }
      }))
    );
  }
    
  CopiarPlantilla(
    nombre_plantilla : string , // El archivo a reemplazar
    nombre_archivo : string , // El nombre del archivo actual
  ): Observable <any> {

    return this.http.get(this.url + 'plantillas/actualizar-plantilla-reemplazar.php', {
    params: new  HttpParams()
      .set('prnombreplantilla', nombre_plantilla )
      .set('prnombrearchivo', nombre_archivo )
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return true;
      } else {
        console.log ('No hay datos que mostrar');
        return false;
      }
    }));
  }
}
