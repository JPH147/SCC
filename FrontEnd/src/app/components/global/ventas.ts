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

	ListarTalonarioSerie():Observable<any>
	{
		return this.http.get(this.url+'talonario/read-serie.php',{
			params: new HttpParams()
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].series
			}else{
				console.log('No hay datos que mostrar')
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
				console.log('No hay datos que mostrar')
			}
		}))
	}

	ListarBancos(){
		return this.http.get(this.url+'banco/read.php')
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].bancos
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	ListarComisionRetenida(){
		return this.http.get(this.url+'comision-retenida/read.php')
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data']
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

}
