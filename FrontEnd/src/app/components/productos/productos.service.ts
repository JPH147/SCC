import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url'

@Injectable()

export class ProductoService {
	
	public url:string=URL.url;

	constructor(private http:HttpClient){}

	Listado(
		idproducto:number
	):Observable<Producto[]>
	{	
		let id;
		if (idproducto==null) {
			id="";
		}else{
			id=idproducto;
		}

		return this.http.get(this.url+'producto/read.php?pridproducto='+id)
		.pipe(map(res=>{
			if(res["codigo"]==0){
				return res["data"].productos
			} else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}
}

export interface Producto{
	id:number,
	nombre: string,
	tipo: string,
	marca:string,
	modelo:string,
	descripcion:string,
	unidad_medida:string
}