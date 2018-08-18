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
  ) {}

  Listado(
    almacen: string,
    producto:number
    ): Observable <any> {

      let Almacen:string="";
      let Producto:string="";

      if(producto>0){
        Producto=producto.toString()
      }

      return this.http.get(this.url + 'productoserie/read.php', {
        params: new HttpParams()
          .set('pralmacen', almacen)
          .set('prproducto',Producto)
      })
      .pipe (map(res => {
        if (res['codigo'] === 0) {
          return res['data'].producto_series;
        } else {
           console.log('Error al importar los datos, revisar servicio');
           return res;
        }
      }));
    }
}

export interface ProductoSerie {
  numero: number;
  producto: string;
    serie: string;
}
