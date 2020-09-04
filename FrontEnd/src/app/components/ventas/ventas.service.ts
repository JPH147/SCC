import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn:'root'
})

export class VentaService {

  public url: string = URL.url;

  constructor(private http: HttpClient) {}

  CrearVenta(
    fecha:Date,
    sucursal:number,
    talonario:number,
    autorizador:number,
    cliente:number,
    cliente_direccion:string,
    cliente_telefono:string,
    cliente_cargo:string,
    cliente_trabajo:string,
    lugar:string,
    vendedor:number,
    tipo_venta:number,
    id_salida_ventas:number,
    tipo_pago:number,
    inicial:number,
    cuotas:number,
    total:number,
    fechainicio:Date,
    foto:string,
    pdfdni:string,
    pdfcip:string,
    pdfcontrato:string,
    pdfvoucher:string,
    pdfplanilla:string,
    pdfletra:string,
    pdfautorizacion:string,
    pdf_oficio:string,
    pdfotros:string,
    observaciones:string,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prfecha',moment(fecha).format("YYYY-MM-DD"))
      .set('prsucursal',sucursal.toString())
      .set('prtalonario',talonario.toString())
      .set('prautorizador',autorizador.toString())
      .set('prcliente',cliente.toString())
      .set('prclientedireccion',cliente_direccion)
      .set('prclientetelefono',cliente_telefono)
      .set('prclientecargo',cliente_cargo)
      .set('prclientetrabajo',cliente_trabajo)
      .set('prlugar',lugar)
      .set('prvendedor',vendedor.toString())
      .set('prtipoventa',tipo_venta.toString())
      .set('prsalida',id_salida_ventas.toString())
      .set('prtipopago',tipo_pago.toString())
      .set('prinicial',inicial.toString())
      .set('prcuotas',cuotas.toString())
      .set('prtotal',total.toString())
      .set('prfechainicio',moment(fechainicio).format("YYYY-MM-DD"))
      .set('prfoto',foto)
      .set('prpdfdni',pdfdni)
      .set('prpdfcip',pdfcip)
      .set('prpdfcontrato',pdfcontrato)
      .set('prpdfvoucher',pdfvoucher)
      .set('prpdfplanilla',pdfplanilla)
      .set('prpdfletra',pdfletra)
      .set('prpdfautorizacion',pdfautorizacion)
      .set('prpdfoficio', pdf_oficio)
      .set('prpdfotros',pdfotros)
      .set('probservaciones',observaciones)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create.php', params, {headers: headers});
  }

  // Cuando se actualiza la venta, en el procedimiento
  // se eliminan el cronograma actual y los garantes
  ActualizarVenta(
    id:number,
    fecha:Date,
    sucursal:number,
    talonario:number,
    autorizador:number,
    cliente:number,
    cliente_direccion:string,
    cliente_telefono:string,
    cliente_cargo:string,
    cliente_trabajo:string,
    lugar:string,
    vendedor:number,
    tipo_venta:number,
    id_salida_ventas:number,
    tipo_pago:number,
    inicial:number,
    cuotas:number,
    total:number,
    fechainicio:Date,
    foto:string,
    pdfdni:string,
    pdfcip:string,
    pdfcontrato:string,
    pdfvoucher:string,
    pdfplanilla:string,
    pdfletra:string,
    pdfautorizacion:string,
    pdf_oficio:string,
    pdfotros:string,
    observaciones:string,
  ): Observable<any> {
    let params = new HttpParams()
    .set('prid',id.toString())
    .set('prfecha',moment(fecha).format("YYYY-MM-DD"))
    .set('prsucursal',sucursal.toString())
    .set('prtalonario',talonario.toString())
    .set('prautorizador',autorizador ? autorizador.toString() : "0")
    .set('prcliente',cliente.toString())
    .set('prclientedireccion',cliente_direccion)
    .set('prclientetelefono',cliente_telefono)
    .set('prclientecargo',cliente_cargo)
    .set('prclientetrabajo',cliente_trabajo)
    .set('prlugar',lugar)
    .set('prvendedor',vendedor.toString())
    .set('prtipoventa',tipo_venta.toString())
    .set('prsalida',id_salida_ventas.toString())
    .set('prtipopago',tipo_pago.toString())
    .set('prinicial',inicial.toString())
    .set('prcuotas',cuotas.toString())
    .set('prtotal',total.toString())
    .set('prfechainicio',moment(fechainicio).format("YYYY-MM-DD"))
    .set('prfoto',foto)
    .set('prpdfdni',pdfdni)
    .set('prpdfcip',pdfcip)
    .set('prpdfcontrato',pdfcontrato)
    .set('prpdfvoucher',pdfvoucher)
    .set('prpdfplanilla',pdfplanilla)
    .set('prpdfletra',pdfletra)
    .set('prpdfautorizacion',pdfautorizacion)
    .set('prpdfoficio', pdf_oficio)
    .set('prpdfotros',pdfotros)
    .set('probservaciones',observaciones)

    // console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/update.php', params, {headers: headers}); 
  }

  ActualizarVentaDocumentos(
    id:number,
    foto:string,
    pdfdni:string,
    pdfcip:string,
    pdfcontrato:string,
    pdfvoucher:string,
    pdfplanilla:string,
    pdfletra:string,
    pdfautorizacion:string,
    pdfoficio:string,
    pdfotros:string,
  ): Observable<any> {
    let params = new HttpParams()
    .set('prid',id.toString())
    .set('prfoto',foto)
    .set('prpdfdni',pdfdni)
    .set('prpdfcip',pdfcip)
    .set('prpdfcontrato',pdfcontrato)
    .set('prpdfvoucher',pdfvoucher)
    .set('prpdfplanilla',pdfplanilla)
    .set('prpdfletra',pdfletra)
    .set('prpdfautorizacion',pdfautorizacion)
    .set('prpdfoficio',pdfoficio) 
    .set('prpdfotros',pdfotros) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/update-documentos.php', params, {headers: headers}); 
  }

  // estado: 1. Por pagar, 2. Pagado
  CrearVentaCronograma(
    venta:number,
    id_tipo_pago : number ,
    monto:number,
    vencimiento:Date,
    estado:number
  ): Observable<any> {

    let params = new HttpParams()
    .set('prventa',venta.toString())
    .set('prtipopago',id_tipo_pago.toString())
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

  CrearVentaGarante(
    venta:number,
    cliente:number,
    direccion:string,
    telefono:string,
    dni:string,
    cip:string,
    planilla:string,
    letra:string,
    voucher:string
  ): Observable<any> {

    let params = new HttpParams()
    .set('prventa',venta.toString())
    .set('prcliente',cliente.toString())
    .set('prdireccion',direccion)
    .set('prtelefono',telefono)
    .set('prdni',dni)
    .set('prcip',cip)
    .set('prplanilla',planilla)
    .set('prletra',letra)
    .set('prvoucher',voucher)

    console.log(params)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/create-garante.php', params, {headers: headers});
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
    observacion:string
  ): Observable<any>{
    let params = new HttpParams()
    .set('prtransaccion',id_transaccion.toString())
    .set('prfecha',moment(fecha).format("YYYY-MM-DD"))
    .set('probservacion',observacion)

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
        res['data']
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
      }
    }))
  }

  SeleccionarVentaSalida(
    id_venta:number
  ): Observable<any>{
    return this.http.get(this.url + 'venta/readxId-salida.php', {
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
    documento:string,
    fecha: Date,
    estado:number,
    pagina:number,
    total_pagina:number,
  ) : Observable<any> {

    let params = new HttpParams()
      .set('prcliente',cliente.toString())
      .set('prdocumento',documento)
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prestado',estado.toString())
      .set('prpagina',pagina.toString())
      .set('prtotalpagina',total_pagina.toString())

    return this.http.get(this.url + 'venta/readxcliente.php', { params })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      }  else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  EliminarVenta(
    id_venta:number,
    observacion:string,
    monto:number
  ): Observable<any>{
    let params = new HttpParams()
      .set('prid',id_venta.toString())
      .set('probservacion',observacion)
      .set('prmonto',monto.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/delete.php', params, {headers: headers});
  }

  EliminarProductosVenta(
    id_venta:number,
    id_serie:number,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prid',id_venta.toString())
    .set('prserie',id_serie.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/delete-producto.php', params, {headers: headers});
  }

  EliminarProductosSalidaVenta(
    id_salida:number,
    id_venta_producto:number,
    id_serie:number,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prsalida',id_salida.toString())
    .set('prventaproducto',id_venta_producto.toString())
    .set('prserie',id_serie.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/delete-producto-salida.php', params, {headers: headers});
  }

  EliminarComisionVenta(
    id_venta:number,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prid',id_venta.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/delete-comision.php', params, {headers: headers});
  }

  EliminarCronogramaVenta(
    id_venta:number,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prid',id_venta.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/delete-cronograma.php', params, {headers: headers});
  }

  EliminarVentaGarante(
    id_venta:number,
  ): Observable<any>{
    let params = new HttpParams()
    .set('prid',id_venta.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/delete-garante.php', params, {headers: headers});
  }

  ListarCronograma(
    id_venta:number,
    orden:string,
  ){
    return this.http.get(this.url + 'venta/read-cronograma.php', {
      params: new HttpParams()
      .set('prventa',id_venta.toString())
      .set('prorden',orden)
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

  ListarPagosCronograma(
    id_cronograma:number,
    pagina_inicio:number,
    pagina_final:number
  ){
    return this.http.get(this.url + 'venta/read-cronograma-pagos.php', {
      params: new HttpParams()
      .set('prcronograma',id_cronograma.toString())
      .set('prpagina',pagina_inicio.toString())
      .set('prtotalpagina',pagina_final.toString())
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

  ActualizarProductoSalida(
    id_venta: number,
    id_producto_serie: number,
    monto: number,
  ) : Observable <any> {

    let params = new HttpParams()
      .set('prventa',id_venta.toString())
      .set('prserie',id_producto_serie.toString())
      .set('prmonto',monto.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'venta/update-producto-salida.php', params, {headers: headers});
  }

}