import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {URL} from './url'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable()

export class ServiciosDirecciones{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	/**************************/
	/* Departamentos */
	ListarDepartamentos(
		nombre:string
	):Observable<Departamento[]>
	{
		return this.http.get(this.url+'direcciondepartamento/read.php',{
			params: new HttpParams()
			.set('prnombre', nombre)
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].departamentos
			}else{
				console.log('Error al importar los datos, revisar servicio')
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
				return res=res['data']
			}else{
				console.log('Error al importar los datos, revisar servicio')
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

	/**************************/

	ListarProvincias(
		departamento:string,
		provincia:string
	):Observable<Provincia[]>
	{
		return this.http.get(this.url+'direccionprovincia/read.php',{
			params: new HttpParams()
			.set('prdepartamento', departamento)
			.set('prprovincia', provincia)
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].provincias
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	ListarDistritos(
		departamento:string,
		provincia:string,
		distrito:string
	):Observable<Distrito[]>
	{
		return this.http.get(this.url+'direcciondistrito/read.php',{
			params: new HttpParams()
			.set('prdepartamento', departamento)
			.set('prprovincia', provincia)
			.set('prdistrito',distrito)
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].distritos
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}
}

export interface Departamento{
	numero:number,
	id:number,
	nombre:string,
}

export interface Provincia{
	numero:number,
	id:number,
	departamento:string,
	nombre:string,	
}

export interface Distrito {
	numero:number,
	id:number,
	departamento:string,
	provincia:string,
	nombre:string,		
}