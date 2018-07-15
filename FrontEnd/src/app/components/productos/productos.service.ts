import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';

@Injectable()

export class ProductoService {

	public url: string = URL.url;

	constructor(private http: HttpClient){}

	Listado(
		tipo: string,
		marca: string,
		modelo: string,
		descripcion: string
	):Observable<Producto[]>
	{
 		return this.http.get(this.url+ 'producto/read.php?prtipo=' + tipo + '&prmarca='+ marca +'&prmodelo='+ modelo + '&prdescripcion = '+descripcion)
		.pipe(map(res => {
			if(res['codigo'] == 0) {
				return res['data'].productos;
			} else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	Eliminar(
		producto:number
	):Observable<any>
	{
		let params = "idproducto="+producto;
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url+'producto/delete.php', params, {headers: headers});
	}

	Agregar(
		modelo:number,
		descripcion:string
	):Observable<any>{
		let params = "id_modelo="+modelo+"prd_descripcion="+descripcion;
		let params2 = "";
		let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
		return this.http.post(this.url+'producto/create.php', params2, {headers: headers});
	}

}

export interface Producto {
  numero: number;
	id: number;
	nombre: string;
	tipo: string;
	marca: string;
	modelo: string;
	descripcion: string;
	unidad_medida: string;
}
