import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';


@Injectable({
  providedIn: 'root'
})

export class ServiciosTelefonos {

 public url: string = URL.url;

  constructor(
        private http: HttpClient,
  ) {}

  CrearTelefono(
        id_cliente: number,
        tlf_numero: string,
        id_tipo: number,
  ): Observable<any> {

    let params = new HttpParams()
    .set('id_cliente', id_cliente.toString())
    .set('tlf_numero', tlf_numero)
    .set('id_tipo', id_tipo.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'clientetelefono/create.php', params, {headers: headers});
  }

  ActualizarTelefono(
    id_telefono: number,
    tlf_numero: string,
    id_tipo: number,
  ): Observable<any> {

    let params = new HttpParams()
    .set('prid', id_telefono.toString())
    .set('tlf_numero', tlf_numero)
    .set('id_tipo', id_tipo.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'clientetelefono/update.php', params, {headers: headers});
  }

  ListarTelefono(
	id_cliente:number,
	tlf_relevancia:string,
    pagina:number,
    total_pagina:number,
  ): Observable <any>
  {
  	return this.http.get(this.url + 'clientetelefono/read.php',{
  		params: new HttpParams()
  		.set('id_cliente', id_cliente.toString())
  		.set('tlf_relevancia', tlf_relevancia)
      .set('prpagina', pagina.toString())
      .set('prtotalpagina', total_pagina.toString())
  	})
  	.pipe(map(res=>{
              // console.log(res);
  		if(res['codigo'] === 0) {
  			return res
  		} else {
  			console.log('No hay datos que mostrar');
        return res;
  		}
  	}))
  }

  EliminarTelefono(
    id_telefono:number
  ): Observable<any>{

    let params = new HttpParams()
    .set('prid', id_telefono.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    return this.http.post(this.url + 'clientetelefono/delete.php', params, {headers: headers});
  }

  EstablecerTelefono(
    id_telefono:number
  ): Observable<any>{

    let params = new HttpParams()
    .set('prtelefono', id_telefono.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    return this.http.post(this.url + 'clientetelefono/actualizar-primario.php', params, {headers: headers});
  }

}

export interface Telefono {
    numero: number;
    id: number;
    cliente: string;
    nrotelefono: string;
    observacion: string;
    id_tipo: number;
    tlf_relevancia: number;
}
