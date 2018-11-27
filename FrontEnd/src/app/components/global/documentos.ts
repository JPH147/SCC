import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {URL} from './url'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable()

export class ServiciosDocumentos{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	/************************************************************************************************/
	ValidarDocumento(
		tipo:number,
		referente:number,
		documento:string,
	):Observable<any>
	{
		return this.http.get(this.url+'transaccioncabecera/validar.php',{
			params: new HttpParams()
			.set('prtipo', tipo.toString())
			.set('prreferente',referente.toString())
			.set('prdocumento',documento)
		})
		.pipe(map(res=>{
			// console.log(res)
			if(res['codigo']===0){
				return res=res['data']
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

}