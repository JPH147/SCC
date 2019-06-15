import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL,URLIMAGENES} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

	ComisionesListado(
	  estado_comision_efectiva: number,
	  estado_comision_retenida: number,
	  vendedor: string,
	  fecha_inicio:Date,
	  fecha_fin:Date,
	  pecosa: string,
	  pagina: number,
	  totalpagina: number
	): Observable<any>  {

		let params = new HttpParams()
			.set('prestadoefectivas', estado_comision_efectiva.toString())
			.set('prestadoretenidas',estado_comision_retenida.toString())
			.set('prvendedor',vendedor)
			.set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
			.set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD"))
			.set('prpecosa',pecosa)
			.set('prpagina',pagina.toString())
			.set('prtotalpagina',totalpagina.toString())

		// console.log(params);

	  return this.http.get(this.url + 'vendedor/read-comisiones.php',{params})
	  .pipe(map(res => {
		  if (res['codigo'] === 0) {
		    return res;
		  }else {
		    console.log('No hay datos que mostrar');
		    return res;
		  }
	  }));
  }

  ListarComisionesxVendedor(
  	id_vendedor:number,
	  pagina: number,
	  totalpagina: number
  ){
		let params = new HttpParams()
			.set('prid', id_vendedor.toString())
			.set('prpagina',pagina.toString())
			.set('prtotalpagina',totalpagina.toString())

		// console.log(params)

	  return this.http.get(this.url + 'vendedor/read-comisionesxvendedor.php',{params})
	  .pipe(map(res => {
		  if (res['codigo'] === 0) {
		    return res;
		  }else {
		    console.log('No hay datos que mostrar');
		    return res;
		  }
	  }));
  }

}
