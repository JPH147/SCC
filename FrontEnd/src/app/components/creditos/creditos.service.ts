import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class CreditosService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient
  ) { }

  Listar(
    cliente:string,
    tipo_credito:number,
    documentos:number,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
    orden:string
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',cliente)
      .set('prtipo_credito',tipo_credito.toString())
      .set('prdocumentos',documentos.toString())
      .set('prfecha_inicio',moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfecha_fin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString())
      .set('prpagina',pagina_inicio.toString())
      .set('prtotalpagina',pagina_final.toString())
      .set('prorden',orden)

    // console.log(params);

    return this.http.get(this.url + 'credito/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        let numero_credito: string;
        let largo:number;
        res['data'].creditos.forEach((item) => {

          numero_credito = item.numero_credito.toString();
          largo = numero_credito.length;

          for(let i = largo ; i < 3 ; i++){
            numero_credito = "0" + numero_credito;
          }

          item.numero_credito = numero_credito
        });
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarPresupuesto(
    cliente:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    pagina_inicio:number,
    pagina_final:number,
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',cliente)
      .set('prfechainicio',moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString())
      .set('prpagina',pagina_inicio.toString())
      .set('prtotalpagina',pagina_final.toString())

    return this.http.get(this.url + 'presupuesto/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  Seleccionar(
    id_credito: number
  ) : Observable <any> {

    let params = new HttpParams()
      .set("prcredito", id_credito.toString())

    return this.http.get(this.url + 'credito/readxId.php', {params})
    .pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }))

  }

  SeleccionarPresupuesto(
    id: number ,
  ){
    let params = new HttpParams()
      .set("prid", id.toString())

    return this.http.get(this.url + 'presupuesto/readxId.php', { params })
    .pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  Crear(
    tipo_credito:number,
    sucursal:number,
    fecha_credito:Date,
    numero_afiliacion:number,
    numero_credito:number,
    autorizador:number,
    vendedor:number,
    cliente:number,
    cliente_direccion:string,
    cliente_telefono:string,
    cliente_cargo:string,
    cliente_trabajo:string,
    tipo_pago:number,
    fecha_pago:Date,
    interes:number,
    capital:number,
    cuotas:number,
    total:number,
    pdf_foto:string,
    pdf_dni:string,
    pdf_cip:string,
    pdf_planilla:string,
    pdf_voucher:string,
    pdf_recibo:string,
    pdf_casilla:string,
    pdf_transaccion:string,
    pdf_autorizacion:string,
    pdf_tarjeta:string,
    pdf_compromiso:string,
    pdf_letra:string,
    pdf_ddjj:string,
    pdf_otros:string,
    observacion:string
  ) :Observable<any> {

    let params = new HttpParams()
      .set('prtipo',tipo_credito.toString())
      .set('prsucursal',sucursal.toString())
      .set('prfecha',moment(fecha_credito).format("YYYY-MM-DD"))
      .set('prcodigo',numero_afiliacion.toString())
      .set('prnumero',numero_credito.toString())
      .set('prautorizador',autorizador.toString())
      .set('prvendedor',vendedor.toString())
      .set('prcliente',cliente.toString())
      .set('prclientedireccion',cliente_direccion)
      .set('prclientetelefono',cliente_telefono)
      .set('prclientecargo',cliente_cargo)
      .set('prclientetrabajo',cliente_trabajo)
      .set('prtipopago',tipo_pago.toString())
      .set('prfechapago',moment(fecha_pago).format("YYYY-MM-DD"))
      .set('printeres',interes.toString())
      .set('prcapital',capital.toString())
      .set('prcuotas',cuotas.toString())
      .set('prtotal',total.toString())
      .set('prpdffoto',pdf_foto)
      .set('prpdfdni',pdf_dni)
      .set('prpdfcip',pdf_cip)
      .set('prpdfplanilla',pdf_planilla)
      .set('prpdfvoucher',pdf_voucher)
      .set('prpdfrecibo',pdf_recibo)
      .set('prpdfcasilla',pdf_casilla)
      .set('prpdftransaccion',pdf_transaccion)
      .set('prpdfautorizacion',pdf_autorizacion)
      .set('prpdftarjeta',pdf_tarjeta)
      .set('prpdfcompromiso',pdf_compromiso)
      .set('prpdfletra',pdf_letra)
      .set('prpdfddjj',pdf_ddjj)
      .set('prpdfotros',pdf_otros)
      .set('probservacion',observacion)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/create.php', params, {headers: headers});

  }

  CrearCronograma(
    id_credito:number,
    id_tipo_pago:number,
    capital: number,
    interes: number,
    fecha_vencimiento: Date
  ){
    let params = new HttpParams()
      .set('prcredito',id_credito.toString())
      .set('prtipopago',id_tipo_pago.toString())
      .set('prcapital',capital.toString())
      .set('printeres',interes.toString())
      .set('prfecha',moment(fecha_vencimiento).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/create-cronograma.php', params, {headers: headers});
  }

  CrearCronogramaAfiliacion(
    id_credito:number,
    id_tipo_pago:number,
    monto_cuota: number,
    numero_cuotas: number,
    fecha_vencimiento: Date
  ){
    let params = new HttpParams()
      .set('prcredito',id_credito.toString())
      .set('prtipopago',id_tipo_pago.toString())
      .set('prmonto',monto_cuota.toString())
      .set('prcuotas',numero_cuotas.toString())
      .set('prprimeracuota',moment(fecha_vencimiento).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/create-cronograma-afiliacion.php', params, {headers: headers});
  }

  CrearGarante(
    credito : number,
    cliente : number,
    cliente_telefono : string,
    cliente_direccion : string,
    pdfdni : string,
    pdfcip : string,
    pdfplanilla : string,
  ){
    let params = new HttpParams()
      .set('prcredito',credito.toString())
      .set('prcliente',cliente.toString())
      .set('prclientetelefono',cliente_telefono)
      .set('prclientedireccion',cliente_direccion)
      .set('prpdfdni',pdfdni)
      .set('prpdfcip',pdfcip)
      .set('prpdfplanilla',pdfplanilla)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/create-garante.php', params, {headers: headers});
  }

  CrearCourier(
    id_venta : number ,
    id_credito : number,
    id_courier : number,
    fecha : Date,
    numero_seguimiento : string,
    pdf_foto : string,
    observacion : string,
  ){
    let params = new HttpParams()
      .set('prventa',id_venta.toString())
      .set('prcredito',id_credito.toString())
      .set('prcourier',id_courier.toString())
      .set('prfecha',moment(fecha).format("YYYY-MM-DD"))
      .set('prseguimiento',numero_seguimiento)
      .set('prpdffoto',pdf_foto)
      .set('probservacion',observacion)

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'seguimiento/crear.php', params, {headers: headers});
  }

  Actualizar(
    id_credito:number,
    sucursal:number,
    fecha_credito:Date,
    autorizador:number,
    vendedor:number,
    cliente:number,
    cliente_direccion:string,
    cliente_telefono:string,
    cliente_cargo:string,
    cliente_trabajo:string,
    tipo_pago:number,
    fecha_pago:Date,
    interes:number,
    capital:number,
    cuotas:number,
    total:number,
    pdf_foto:string,
    pdf_dni:string,
    pdf_cip:string,
    pdf_planilla:string,
    pdf_voucher:string,
    pdf_recibo:string,
    pdf_casilla:string,
    pdf_transaccion:string,
    pdf_autorizacion:string,
    pdf_tarjeta:string,
    pdf_compromiso:string,
    pdf_letra:string,
    pdf_ddjj:string,
    pdf_otros:string,
    observacion:string
  ) :Observable<any> {

    let params = new HttpParams()
      .set('prcredito',id_credito.toString())
      .set('prsucursal',sucursal.toString())
      .set('prfecha',moment(fecha_credito).format("YYYY-MM-DD"))
      .set('prautorizador',autorizador ? autorizador.toString() : "0")
      .set('prvendedor',vendedor.toString())
      .set('prcliente',cliente.toString())
      .set('prclientedireccion',cliente_direccion)
      .set('prclientetelefono',cliente_telefono)
      .set('prclientecargo',cliente_cargo)
      .set('prclientetrabajo',cliente_trabajo)
      .set('prtipopago',tipo_pago.toString())
      .set('prfechapago',moment(fecha_pago).format("YYYY-MM-DD"))
      .set('printeres',interes.toString())
      .set('prcapital',capital.toString())
      .set('prcuotas',cuotas.toString())
      .set('prtotal',total.toString())
      .set('prpdffoto',pdf_foto)
      .set('prpdfdni',pdf_dni)
      .set('prpdfcip',pdf_cip)
      .set('prpdfplanilla',pdf_planilla)
      .set('prpdfvoucher',pdf_voucher)
      .set('prpdfrecibo',pdf_recibo)
      .set('prpdfcasilla',pdf_casilla)
      .set('prpdftransaccion',pdf_transaccion)
      .set('prpdfautorizacion',pdf_autorizacion)
      .set('prpdftarjeta',pdf_tarjeta)
      .set('prpdfcompromiso',pdf_compromiso)
      .set('prpdfletra',pdf_letra)
      .set('prpdfddjj',pdf_ddjj)
      .set('prpdfotros',pdf_otros)
      .set('probservacion',observacion)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/update.php', params, {headers: headers});

  }

  Proximo(
    id_cliente: number
  ) : Observable<any> {

    let params = new HttpParams()
      .set('prcliente', id_cliente.toString())

    return this.http.get(this.url + 'credito/proximo.php', {params})
    .pipe(map(res=>{
      if(res['codigo'] === 0){
        return res['data']
      }else{
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  Verificar_Afiliacion(
    cliente: number
  ) : Observable<any> {

    let params = new HttpParams()
    .set('prcliente', cliente.toString())

    return this.http.get(this.url + 'credito/verificar-afiliacion.php', {params})
    .pipe(map(res=>{
      if(res['codigo'] === 0){
        return res['data']
      }else{
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  Verificar_Interes(
    monto: number
  ) : Observable<any> {

    let params = new HttpParams()
    .set('prmonto', monto.toString())

    return this.http.get(this.url + 'credito/verificar-interes.php', {params})
    .pipe(map(res=>{
      if(res['codigo'] === 0){
        return res['data']
      }else{
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  ObtenerCrongrama(
    id_credito: number,
    orden: string
  ) : Observable <any> {

    let params = new HttpParams()
    .set('prcredito', id_credito.toString())
    .set('prorden', orden)

    // console.log(params)

    return this.http.get(this.url + 'credito/read-cronograma.php', {params})
    .pipe(map(res=>{
      if(res['codigo'] === 0){
        return res['data']
      }else{
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  SeleccionarParametros(){

    return this.http.get(this.url + 'credito/seleccionar-parametros-afiliacion.php')
    .pipe(map(res=>{
      if(res['codigo'] === 0){
        return res['data']
      }else{
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  ListarTipos() : Observable<any> {
    return this.http.get(this.url + "credito/read-tipo.php")
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return res['data']
        } else {
          console.log("No hay datos que mostrar")
          return [];
        }
      })
    )
  }

  ActualizarPresupuesto(
    id : number ,
    estado : number
  ){
    let params = new HttpParams()
      .set('prid',id.toString())
      .set('prestado',estado.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'presupuesto/update.php', params, {headers: headers});
  }

  EliminarCredito(
    id_credito : number
  ){
    let params = new HttpParams()
      .set('prcredito',id_credito.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/eliminar.php', params, {headers: headers});
  }

  ListarCronogramaxCliente(
    cliente:number
  ): Observable<any> {

    let params = new HttpParams()
      .set('prcliente',cliente.toString());

    return this.http.get(this.url + 'credito/read-cronogramaxcliente.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

}
