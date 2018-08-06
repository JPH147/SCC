import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';


@Injectable()

export class ServiciosTelefonos{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	CrearTelefono(
        id_cliente:number,
        tlf_numero:string,
        tlf_observacion:string,
        id_tipo:number,
        tlf_relevancia:number
	):Observable<any>{
        let params = 'id_cliente=' + id_cliente + '&tlf_numero=' + tlf_numero
        + '&tlf_observacion=' + tlf_observacion + '&id_tipo=' + id_tipo
        + '&tlf_relevancia=' + tlf_relevancia;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        console.log(params);
        return this.http.post(this.url+'clientetelefono/create.php',params,{headers:headers});
	}
}

export interface Telefono{
	numero:number,
	id:number,
    nrotelefono:string,
    observacion: string,
    id_tipo:number,
    tlf_relevancia:number
}
