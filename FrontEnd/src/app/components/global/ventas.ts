import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {URL} from './url'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable()

export class ServiciosVentas{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	ListarVendedor(
		dni:number,
		nombre:string,
		sucursal:string,
	):Observable<any>
	{

		let DNI:string;

		if(dni){
			DNI=dni.toString()
		}else{
			DNI=""
		}

		return this.http.get(this.url+'vendedor/read.php',{
			params: new HttpParams()
			.set('vnd_dni', DNI)
			.set('vnd_nombre',nombre)
			.set('scs_nombre',sucursal)
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	ListarTalonarioSerie():Observable<any>
	{
		return this.http.get(this.url+'talonario/read-serie.php',{
			params: new HttpParams()
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].series
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	ListarTalonarioNumero(
		serie:number
	):Observable<any>
	{
		let Serie:string

		if (serie) {
			Serie=serie.toString()
		}else{
			Serie=""
		}

		return this.http.get(this.url+'talonario/read-numero.php',{
			params: new HttpParams()
			.set('prserie',Serie)
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].numeros
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}
}
