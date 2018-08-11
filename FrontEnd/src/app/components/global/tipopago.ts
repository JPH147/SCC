import {Injectable} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';


@Injectable()

export class ServiciosTipoPago{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	/************************************************************************************************/
	ListarTipoPago():Observable<any>
	{
		return this.http.get(this.url+'tipopago/read.php',{})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data'].tipopago;
			}else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
    }
}
export interface TipoPago{
	id:number,
	nombre:string,
}