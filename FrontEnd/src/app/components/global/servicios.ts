import {Injectable} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'
import {URL} from './url';


@Injectable()

export class ServiciosGenerales{
	public url:string= URL.url;

	constructor(
		private http:HttpClient){ }

	ngOnInit(){}

	ListarTipoProductos(
		nombre:string,
		unidad_medida:string
	):Observable<TipoProductoModelo>
	{
		return this.http.get(this.url+'productotipo/read.php?prnombre='+nombre+'&prum'+unidad_medida)
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data'].tipo_productos;
			} else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	ListarMarca(
		id_tipo:string,
		nombre:string
	):Observable<MarcaModelo>
	{

		return this.http.get(this.url+'productomarca/read.php?prtipo='+id_tipo+'&prmarca'+nombre)
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data'].marca;
			} else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	ListarModelo(
		id_marca:string,
		nombre:string
	):Observable<ModeloModelo>
	{
		return this.http.get(this.url+'productomodelo/read.php?prmarca='+id_marca+'&prnombre'+nombre)
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data'].modelo;
			} else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}

	ListarInstitucion(
	):Observable<Institucion>
	{
		return this.http.get(this.url+'institucion/read.php')
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res['data'].institucion;
			} else{
				console.log('Error al importar los datos, revisar servicio')
			}
		}))
	}



}

export interface TipoProductoModelo{
	numero:number,
	id:number,
	nombre:string,
	unidad_medida:string
}

export interface MarcaModelo{
	numero:number,
	id:number,
	tipo:string,
	nombre:string
}

export interface ModeloModelo{
	numero:number,
	id:number,
	tipo:string,
	marca:string,
	modelo:string
}
export interface Institucion{
	numero:number,
	id:string,
	nombre:string
}