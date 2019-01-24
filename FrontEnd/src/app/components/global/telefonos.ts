import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';


@Injectable()

export class ServiciosTelefonos {

 public url: string = URL.url;

  constructor(
        private http: HttpClient,
  ) {}

  CrearTelefono(
        id_cliente: number,
        tlf_numero: string,
        tlf_observacion: string,
        id_tipo: number,
        tlf_relevancia: number
  ): Observable<any> {

        let params = new HttpParams()
        .set('id_cliente', id_cliente.toString())
        .set('tlf_numero', tlf_numero)
        .set('tlf_observacion', tlf_observacion)
        .set('id_tipo', id_tipo.toString())
        .set('tlf_relevancia', tlf_relevancia.toString())

        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(this.url + 'clientetelefono/create.php', params, {headers: headers});
  }

  ListarTelefono(
	id_cliente:number,
	tlf_relevancia:string,

  ): Observable <any>
  {
  	return this.http.get(this.url + 'clientetelefono/read.php',{
  		params: new HttpParams()
  		.set('id_cliente', id_cliente.toString())
  		.set('tlf_relevancia', tlf_relevancia)
  	})
  	.pipe(map(res=>{
              // console.log(res);
  		if(res['codigo'] === 0) {
  			return res['data'].telefonos;
  		} else {
  			// console.log('No hay datos que mostrar');
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
