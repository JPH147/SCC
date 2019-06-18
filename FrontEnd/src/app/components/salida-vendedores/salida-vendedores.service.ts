import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class SalidaVendedoresService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  // Cuando no hay salidas anteriores,
  // el servicio envía el número 1
  ObtenerNumero(): Observable<any>{
    return this.http.get(this.url+'salidacabecera/get-number.php')
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      }else {
        return res['data'];
      }
    }));
  }

  Agregar(
    pecosa: number,
    sucursal: number,
    almacen: number,
    fecha: Date,
    destino:string,
    guia: string,
    movilidad_propia: boolean,
    placa: string,
    dni: string,
    nombre:string,
    observacion:string
  ): Observable<any> {

    let params = new HttpParams()
   		.set('prpecosa', pecosa.toString())
   		.set('prsucursal', sucursal.toString())
   		.set('pralmacen', almacen.toString())
   		.set('prfecha', moment(fecha).format("YYYY/MM/DD").toString())
   		.set('prdestino', destino)
   		.set('prguia', guia)
      .set('prvehiculo', movilidad_propia ? placa : "")
      .set('prchoferdni', movilidad_propia ? dni : "")
      .set('prchofernombre', movilidad_propia ? nombre : "")
      .set('probservacion', observacion)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create.php', params, {headers: headers});
  }

  Actualizar(
    id_salida: number,
    fecha: Date,
    destino:string,
    guia: string,
    movilidad_propia: boolean,
    placa: string,
    dni: string,
    nombre:string,
    observacion:string
  ): Observable<any> {

    let params = new HttpParams()
   		.set('prid', id_salida.toString())
   		.set('prfecha', moment(fecha).format("YYYY/MM/DD").toString())
   		.set('prdestino', destino)
   		.set('prguia', guia)
      .set('prvehiculo', movilidad_propia ? placa : "")
      .set('prchoferdni', movilidad_propia ? dni : "")
      .set('prchofernombre', movilidad_propia ? nombre: "")
      .set('probservacion', observacion)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/update.php', params, {headers: headers});
  }

  AgregarProducto(
    cabecera: number,
    serie: number,
    precio: number,
    fecha: Date
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcabecera', cabecera.toString())
      .set('prserie', serie.toString())
      .set('prprecio', precio.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-producto.php', params, {headers: headers});
  }

  AgregarVendedor(
    cabecera: number,
    vendedor: number,
    comision_efectiva: number,
    comision_retenida: number
  ): Observable<any> {

    let params = new HttpParams()
           .set('prcabecera', cabecera.toString())
           .set('prvendedor', vendedor.toString())
           .set('prcomisionefectiva', comision_efectiva.toString())
           .set('prcomisionretenida', comision_retenida.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-vendedor.php', params, {headers: headers});
  }

  AgregarTalonarios(
    cabecera: number,
    talonario: number,
    fecha: Date
  ): Observable<any> {

    let params = new HttpParams()
      .set('prtalonario', talonario.toString())
      .set('prcabecera', cabecera.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-talonario.php', params, {headers: headers});
  }

  CrearLlegada(
    id_cabecera: number,
    fecha: Date,
    observacion: string
  ){
    let params = new HttpParams()
      .set('prid', id_cabecera.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('probservacion', observacion)
      
    // console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-llegada.php', params, {headers: headers});
  }

  CrearLlegadaTalonarios(
    id_talonario: number,
    estado: number
  ){
    let params = new HttpParams()
      .set('prtalonario', id_talonario.toString())
      .set('prestado', estado.toString())
      
    console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    return this.http.post(this.url + 'salidacabecera/create-llegada-talonario.php', params, {headers: headers});
  }

  CrearLlegadaProducto(
    serie:number,
    salida:number,
    almacen:number,
    precio:number,
    fecha:Date,
    documento:string
  ){
    let params = new HttpParams()
      .set('prserie', serie.toString())
      .set('prsalida', salida.toString())
      .set('pralmacen', almacen.toString())
      .set('prprecio', precio.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prdocumento', documento)
      
    console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/create-llegada-producto.php', params, {headers: headers});
  }

  SeleccionarSalida(
    id:number,
  ): Observable<any> {

    return this.http.get(this.url + 'salidacabecera/readxId.php', {
      params: new HttpParams()
      .set('prid', id.toString())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

  ListarVentas(
    id_cabecera:number
  ): Observable<any>{
    return this.http.get(this.url + 'salidacabecera/read-ventas.php', {
      params: new HttpParams()
      .set('prid', id_cabecera.toString())
  })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        let total=0, total_comision=0;
        res['data'].ventas.forEach(item => {
          total=total+item.total;
          total_comision=total_comision+item.comision;
        });
        return ({array:res['data'].ventas, total:total, comision:total_comision})
      }else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarSalidaProductos(
    id_salida:number,
    estado:number
  ): Observable<any> {

    return this.http.get(this.url + 'salidacabecera/read-productos.php', {
      params: new HttpParams()
      .set('prid', id_salida.toString())
      .set('prestado', estado.toString())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

  ListarSalidaViaticos(
    id_salida:number
  ): Observable<any> {

    return this.http.get(this.url + 'salidacabecera/read-viaticos.php', {
      params: new HttpParams()
      .set('prid', id_salida.toString())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

  ListarSalidaTalonarios(
    id_salida:number,
    estado:number
  ): Observable<any> {

    return this.http.get(this.url + 'salidacabecera/read-talonarios.php', {
      params: new HttpParams()
      .set('prid', id_salida.toString())
      .set('prestado', estado.toString())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

  ListarComisiones(
    id_salida: number
  ) : Observable <any> {
    return this.http.get(this.url + 'salidacabecera/read-comisiones.php', {
      params: new HttpParams()
      .set('prid', id_salida.toString())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'].comisiones;
      }  else {
          console.log('No hay datos que mostrar');
          return res;
      }
    }));
  }

  ActualizarSalidaProductos(
    id_detalle: number,
    id_venta: number,
    precio: number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prid', id_detalle.toString())
      .set('prventa', id_venta.toString())
      .set('prprecio', precio.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/update-producto.php', params, {headers: headers});
  }

  ActualizarSalidaTalonarios(
    id_detalle_talonario: number, // Es el id del talonario en la tabla de salida
    id_venta: number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prid', id_detalle_talonario.toString())
      .set('prventa', id_venta.toString())

    // console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/update-talonario.php', params, {headers: headers});
  }

  AnularSalidaProducto(
    id_detalle: number,
    estado: number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prid', id_detalle.toString())
      .set('prestado', estado.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/update-producto-anular.php', params, {headers: headers});
  }

  AnularSalidaTalonario(
    id_detalle: number,
    estado: number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prid', id_detalle.toString())
      .set('prestado', estado.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/update-talonario-anular.php', params, {headers: headers});
  }

  ActualizarComisionesVendedor(
    id_salida_vendedor: number,
    comision_efectiva: number,
    comision_retenida:number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prid', id_salida_vendedor.toString())
      .set('prcomisionefectiva', comision_efectiva.toString())
      .set('prcomisionretenida', comision_retenida.toString())

    // console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'salidacabecera/update-vendedor.php', params, {headers: headers});
  }

}

