import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';


@Injectable()

export class ServiciosProductoSerie {
	public url: string = URL.url;

	constructor(
	private http: HttpClient,
	){}

	Listado(
    id: string,
    ): Observable <any> {
      return this.http.get(this.url + 'productoserie/readxproducto.php', {
        params: new HttpParams()
          .set('prid', id)
      })
      .pipe (map(res => {
        if (res['codigo'] === 0) {
          console.log(res);
          return res['data'].producto_series;
        } else {
           console.log('Error al importar los datos, revisar servicio');
           return res;
        }
      }));
    }
}

export interface ProductoSerie {
	  numero: number,
	  producto: string,
    serie: string
}
