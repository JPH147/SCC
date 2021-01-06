import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL } from 'src/app/core/servicios/url';

@Injectable({
  providedIn: 'root'
})
export class CentrosTrabajoService {


	public url:string = URL.url;

  constructor(
    private _http : HttpClient
  ) { }

  ListarCentroTrabajo(
    departamento : string ,
    provincia : string ,
    distrito : string ,
    comisaria : string ,
    division : string ,
    telefono : string ,
    direccion : string ,
    pagina : number ,
    total_pagina : number ,
	) :Observable<any> {
    let params = new HttpParams()
      .set('prdepartamento', departamento)
      .set('prprovincia', provincia)
      .set('prdistrito', distrito)
      .set('prcomisaria', comisaria)
      .set('prdivision', division)
      .set('prtelefono', telefono)
      .set('prdireccion', direccion)
      .set('prpagina', pagina.toString())
      .set('prtotalpagina', total_pagina.toString()) ;

		return this._http.get(this.url+'cliente/read-centro-trabajo.php',{ params : params })
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res
			}else{
        return false ;
			}
		}))
  }
  
  ListarCentroTrabajoxID(
    id_centro_trabajo : number ,
	) :Observable<any> {
    let params = new HttpParams()
      .set('prid', id_centro_trabajo.toString()) ;

		return this._http.get(this.url+'cliente/read-centro-trabajoxId.php',{ params : params })
		.pipe(map(res=>{
			if(res['codigo']===0 && res['data']?.lenght > 0){
				return res['data'][0] ;
			}else{
        return false ;
			}
		}))
  }

	CrearCentroTrabajo(
		distrito : number ,
    comisaria : string ,
    division : string ,
    telefono : string ,
    direccion : string ,
	):Observable<any>{
		let params=new HttpParams()
		.set('prdistrito', distrito.toString())
		.set('prcomisaria', comisaria)
		.set('prdivision', division)
		.set('prtelefono', telefono)
		.set('prdireccion', direccion) ;
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'cliente/create-centro-trabajo.php',params,{headers:headers});
	}

	ActualizarCentroTrabajo(
		id : number,
		distrito : number ,
    comisaria : string ,
    division : string ,
    telefono : string ,
    direccion : string ,
	):Observable<any>{
    let params = new HttpParams()
      .set('prcentrotrabajo', id.toString())
      .set('prdistrito', distrito.toString())
      .set('prcomisaria', comisaria)
      .set('prdivision', division)
      .set('prtelefono', telefono)
      .set('prdireccion', direccion) ;
			
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this._http.post(this.url+'cliente/update-centro-trabajo.php',params,{headers:headers});
  }
  
  EliminarCentroTrabajo(
		id:number
	):Observable<any>{
		let params = new HttpParams().set('prcentrotrabajo',id.toString());
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this._http.post(this.url + 'cliente/delete-centro-trabajo.php', params, {headers: headers});
	}
}
