import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable()

export class VentaService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  CrearVenta(
    fecha:Date,
    sucursal:number,
    talonario:number,
    autorizador:number,
    cliente:number,
    cliente_direccion:number,
    cliente_telefono:number,
    cliente_cargo:string,
    lugar:string,
    vendedor:number,
    tipo_venta:number,
    tipo_documento:number,
    tipo_pago:number,
    inicial:number,
    cuotas:number,
    total:number,
    fechainicio:Date,
    pdfcontrato:string,
    pdfdni:string,
    pdfcip:string,
    pdfplanilla:string,
    pdfletra:string,
    pdfvoucher:string,
    pdfautorizacion:string,
    observaciones:string,
  ): Observable<any> {

    let params = new HttpParams()
    .set('prfecha',moment(fecha).format("YYYY-MM-DD"))
    .set('prsucursal',sucursal.toString())
    .set('prtalonario',talonario.toString())
    .set('prautorizador',autorizador.toString())
    .set('prcliente',cliente.toString())
    .set('prclientedireccion',cliente_direccion.toString())
    .set('prclientetelefono',cliente_telefono.toString())
    .set('prclientecargo',cliente_cargo)
    .set('prlugar',lugar)
    .set('prvendedor',vendedor.toString())
    .set('prtipoventa',tipo_venta.toString())
    .set('prtipodocumento',tipo_documento.toString())
    .set('prtipopago',tipo_pago.toString())
    .set('prinicial',inicial.toString())
    .set('prcuotas',cuotas.toString())
    .set('prtotal',total.toString())
    .set('prfechainicio',moment(fechainicio).format("YYYY-MM-DD"))
    .set('prpdfcontrato',pdfcontrato)
    .set('prpdfdni',pdfdni)
    .set('prpdfcip',pdfcip)
    .set('prpdfplanilla',pdfplanilla)
    .set('prpdfletra',pdfletra)
    .set('prpdfvoucher',pdfvoucher)
    .set('prpdfautorizacion',pdfautorizacion)
    .set('probservaciones',observaciones)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create.php', params, {headers: headers});
  }

  CrearVentaCronograma(
    venta:number,
    monto:number,
    vencimiento:Date,
    estado:number
  ): Observable<any> {

    let params = new HttpParams()
    .set('prventa',venta.toString())
    .set('prmonto',monto.toString())
    .set('prvencimiento',moment(vencimiento).format("YYYY-MM-DD"))
    .set('prestado',estado.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create-cronograma.php', params, {headers: headers});
  }

  CrearVentaProductos(
    venta:number,
    producto_serie:number,
    precio:number,
  ): Observable<any> {

    let params = new HttpParams()
    .set('prventa',venta.toString())
    .set('prproductoserie',producto_serie.toString())
    .set('prprecio',precio.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create-productos.php', params, {headers: headers});
  }

  CrearComisionVendedor(
    id_venta:number,
    id_vendedor:number,
    monto_venta:number,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prventa',id_venta.toString())
    .set('prvendedor',id_vendedor.toString())
    .set('prmonto',monto_venta.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'vendedor/create-comision.php', params, {headers: headers});
  }

  CrearCanje(
    id_venta_nueva:number,
    id_venta_antigua:number,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prventanueva',id_venta_nueva.toString())
    .set('prventaanterior',id_venta_antigua.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create-canje.php', params, {headers: headers});
  }

  CrearCanjeTransaccion(
    id_transaccion:number,
    fecha:Date,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prtransaccion',id_transaccion.toString())
    .set('prfecha',moment(fecha).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create-canje-transaccion.php', params, {headers: headers});
  }

  ListarVentaTransacciones(
    id_venta:number,
  ): Observable<any>{

    return this.http.get(this.url + 'venta/read-transaccion.php', {
    params: new HttpParams()
    .set('prventa',id_venta.toString())
    }).pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
      }
    }))
  }

  SeleccionarVenta(
    id_venta:number
  ): Observable<any>{

    return this.http.get(this.url + 'venta/readxId.php', {
      params: new HttpParams()
      .set('prid',id_venta.toString())
    }).pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
      }
    }))
  }

  ListarVentasxCliente(
    cliente:number,
    talonario_serie:string,
    talonario_numero:string,
    estado:number,
    pagina:number,
    total_pagina:number,
  ){
    return this.http.get(this.url + 'venta/readxcliente.php', {
      params: new HttpParams()
      .set('prcliente',cliente.toString())
      .set('prtalonarioserie',talonario_serie)
      .set('prtalonarionumero',talonario_numero)
      .set('prestado',estado.toString())
      .set('prpagina',pagina.toString())
      .set('prtotalpagina',total_pagina.toString())
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }  else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
    // prcliente
    // prtalonarioseerie
    // prtalonarionumero
    // prestado
    // prpagina
    // prtotalpagina
  }

}
