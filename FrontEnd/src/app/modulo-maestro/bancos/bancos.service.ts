import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL } from 'src/app/core/servicios/url' ;

@Injectable({
  providedIn: 'root'
})
export class BancosService {

	public url:string = URL.url;

  constructor(
    private _http : HttpClient
  ) { }

	ListarBancos(
    banco : string ,
    pagina_inicio : number ,
    total_pagina : number
  ) : Observable<any> {
    let params = new HttpParams()
      .set('prbanco', banco)
      .set('prpagina', pagina_inicio.toString())
      .set('prtotalpagina', total_pagina.toString()) ;

		return this._http.get(this.url+'banco/read.php', {params: params})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res ;
			}else{
        console.log('No hay datos que mostrar') ;
        return false ;
			}
		}))
  }
  
	CrearBanco(
    banco : string ,
  ) : Observable<boolean> {
    let params = new HttpParams()
      .set('prbanco', banco) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'banco/create.php', params, {headers: headers} )
		.pipe(map(res=>{
			if(res['codigo']===0){
				return true ;
			}else{
        console.log('No hay datos que mostrar') ;
        return false ;
			}
		}))
  }
    
	ActualizarBanco(
    id_banco : number ,
    banco : string ,
  ) : Observable<boolean> {
    let params = new HttpParams()
      .set('prid', id_banco.toString() )
      .set('prbanco', banco) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'banco/update.php', params, {headers: headers} )
		.pipe(map(res=>{
			if(res['codigo']===0){
				return true ;
			}else{
        console.log('No hay datos que mostrar') ;
        return false ;
			}
		}))
  }
      
	EliminarBanco(
    id_banco : number ,
  ) : Observable<boolean> {
    let params = new HttpParams()
      .set('prid', id_banco.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

		return this._http.post(this.url+'banco/delete.php', params, {headers: headers} )
		.pipe(map(res=>{
			if(res['codigo']===0){
				return true ;
			}else{
        console.log('No hay datos que mostrar') ;
        return false ;
			}
		}))
	}
}
