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
        // tslint:disable-next-line:prefer-const
        let params = 'id_cliente=' + id_cliente + '&tlf_numero=' + tlf_numero
        + '&tlf_observacion=' + tlf_observacion + '&id_tipo=' + id_tipo
        + '&tlf_relevancia=' + tlf_relevancia;
        // tslint:disable-next-line:prefer-const
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        console.log(params);
        return this.http.post(this.url + 'clientetelefono/create.php', params, {headers: headers});
  }

  ListarTelefono(
	id_cliente:string,
	tlf_relevancia:string,
// tslint:disable-next-line:no-unused-expression
): Observable <any>
{
	return this.http.get(this.url + 'clientetelefono/read.php',{
		params: new HttpParams()
		.set('id_cliente', id_cliente)
		.set('tlf_relevancia', tlf_relevancia)
	})
	.pipe(map(res=>{
		if(res['codigo'] === 0) {
			return res['data'].telefonos;
		} else {
			console.log('Error al importar los datos, revisar servicio');
		}
	}))
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
