import {Injectable} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';

@Injectable({
  providedIn: 'root'
})
export class ServiciosTipoDocumento{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	/************************************************************************************************/
	ListarTipoDocumento():Observable<any>
	{
		return this.http.get(this.url+'tipodocumento/read.php',{})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data'].tipodocumento;
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
    }
}
export interface TipoDocumento{
	id:number,
	nombre:string,
}