import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {URL} from './url'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable({
	providedIn: 'root'
})

export class ServiciosDirecciones{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	/************************************************************************************************/
	/* Departamentos */
	ListarDepartamentos(
		nombre:string,
		pagina:number,
		total_pagina:number,
	):Observable<any>
	{
		return this.http.get(this.url+'direcciondepartamento/read.php',{
			params: new HttpParams()
			.set('prnombre', nombre)
			.set('prpagina',pagina.toString())
			.set('prtotalpagina',total_pagina.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	SeleccionarDepartamento(
		id:number
	):Observable<Departamento[]>
	{
		return this.http.get(this.url+'direcciondepartamento/readxId.php',{
			params: new HttpParams()
			.set('prid', id.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data']
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	EliminarDepartamento(
		id:number
	):Observable<any>{
		let params = new HttpParams().set('prid',id.toString());
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url + 'direcciondepartamento/delete.php', params, {headers: headers});
	}

	CrearDepartamento(
		nombre:string
	):Observable<any>{
		let params=new HttpParams()	.set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondepartamento/create.php',params,{headers:headers});
	}

	ActualizarDepartamento(
		id:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
				   .set('prid', id.toString())
				   .set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondepartamento/update.php',params,{headers:headers});
	}

	/************************************************************************************************/
	/* Provincias */

	ListarProvincias(
		departamento:string,
		provincia:string,
		pagina:number,
		total_pagina:number,
	):Observable<any>
	{
    let params = new HttpParams()
    .set('prdepartamento', departamento)
    .set('prprovincia', provincia)
    .set('prpagina',pagina.toString())
    .set('prtotalpagina',total_pagina.toString())
    
    // console.log(params);

		return this.http.get(this.url+'direccionprovincia/read.php',{params})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res ;
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	SeleccionarProvincia(
		id:number
	):Observable<Provincia[]>
	{
		return this.http.get(this.url+'direccionprovincia/readxId.php',{
			params: new HttpParams()
			.set('prid', id.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data']
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	EliminarProvincia(
		id:number
	):Observable<any>{
		let params = new HttpParams().set('prid',id.toString());
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url + 'direccionprovincia/delete.php', params, {headers: headers});
	}

	CrearProvincia(
		departamento:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
						.set('prnombre', nombre)
						.set('prdepartamento', departamento.toString());
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direccionprovincia/create.php',params,{headers:headers});
	}

	ActualizarProvincia(
		id:number,
		departamento:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
				   .set('prid', id.toString())
				   .set ('prdepartamento', departamento.toString())
				   .set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direccionprovincia/update.php',params,{headers:headers});
	}

	/************************************************************************************************/
	/* Distritos */
	ListarDistritos(
		departamento:string,
		provincia:string,
		distrito:string,
		pagina:number,
		total_pagina:number,
	):Observable<any>
	{
		return this.http.get(this.url+'direcciondistrito/read.php',{
			params: new HttpParams()
			.set('prdepartamento', departamento)
			.set('prprovincia', provincia)
			.set('prdistrito',distrito)
			.set('prpagina',pagina.toString())
			.set('prtotalpagina',total_pagina.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res ;
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	SeleccionarDistrito(
		id:number
	):Observable<Distrito[]>
	{
		return this.http.get(this.url+'direcciondistrito/readxId.php',{
			params: new HttpParams()
			.set('prid', id.toString())
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data']
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	EliminarDistrito(
		id:number
	):Observable<any>{
		let params = new HttpParams().set('prid',id.toString());
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url + 'direcciondistrito/delete.php', params, {headers: headers});
	}

	CrearDistrito(
		provincia:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
						.set('prnombre', nombre)
						.set('prprovincia', provincia.toString());
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondistrito/create.php',params,{headers:headers});
	}

	ActualizarDistrito(
		id:number,
		provincia:number,
		nombre:string
	):Observable<any>{
		let params=new HttpParams()
				   .set('prid', id.toString())
				   .set ('prprovincia', provincia.toString())
				   .set('prnombre', nombre);
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'direcciondistrito/update.php',params,{headers:headers});
	
	}
/************************************************************************************************/
	CrearDireccion(
		id_cliente: number,
		nombre: string,
		iddistrito: number,
	): Observable<any> {
		let params = new HttpParams()
		.set('id_cliente', id_cliente.toString())
		.set('drc_nombre', nombre)
		.set('pid_distrito', iddistrito.toString())
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url + 'clientedireccion/create.php', params, {headers: headers});
	}

	ActualizarDireccion(
		id_direccion: number,
		nombre: string,
		iddistrito: number,
	): Observable<any> {
		let params = new HttpParams()
      .set('priddireccion', id_direccion.toString())
      .set('drc_nombre', nombre)
      .set('pid_distrito', iddistrito.toString())
    
    // console.log(params) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
		return this.http.post(this.url + 'clientedireccion/update.php', params, {headers: headers})
		.pipe(map(res=>{
			if( res['codigo'] == 0 ) {
				return true ;
			} else {
				return false ;
			}
		}));
	}

	ListarDireccion(
		id_cliente:number,
		drc_relevancia:string,
		pagina:number,
		total_pagina:number,
	): Observable <any>
	{
		return this.http.get(this.url + 'clientedireccion/read.php',{
			params: new HttpParams()
			.set('id_cliente', id_cliente.toString())
			.set('drc_relevancia', drc_relevancia)
			.set('prpagina', pagina.toString())
			.set('prtotalpagina', total_pagina.toString())
		})
		.pipe(map(res=>{
			if(res['codigo'] === 0) {
				return res
			} else {
				return res
			}
		}))
	}

	EliminarDireccion(
		id_direccion: number,
	){
		let params = new HttpParams()
		.set('prid', id_direccion.toString())

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		
		return this.http.post(this.url + 'clientedireccion/delete.php', params, {headers: headers});
	}

	EstablecerDireccion(
		id_direccion: number,
	){
		let params = new HttpParams()
		.set('prdireccion', id_direccion.toString())

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		
		return this.http.post(this.url + 'clientedireccion/actualizar-primario.php', params, {headers: headers});
	}

}



export interface Departamento {
	numero:number,
	id:number,
	nombre: string
}

export interface Provincia {
	numero:number,
	id:number,
	departamento:string,
	nombre:string
}

export interface Distrito {
	numero:number,
	id:number,
	departamento:string,
	provincia:string,
	nombre:string
}

export interface Direccion {
	numero: number,
	idcliente: number,
	cliente: string,
	direccion: string,
	id_departamento: number,
	departamento: string,
	id_provincia: number,
	provincia: string,
	id_distrito: number,
	distrito: string,
	direccioncompleta: string,
	relevancia: number,
	observacion: string
}