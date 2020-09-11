import {Injectable} from '@angular/core';
import {HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';


@Injectable({
  providedIn: 'root'
})
export class ServiciosTipoPago{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	/************************************************************************************************/
	ListarTipoPago(
		importancia : number
	):Observable<any>
	{
		
		let params = new HttpParams()
			.set('primportancia', importancia.toString())

		return this.http.get(this.url+'tipopago/read.php',{params})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data'].tipopago;
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
    }
}
export interface TipoPago{
	id:number,
	nombre:string,
}