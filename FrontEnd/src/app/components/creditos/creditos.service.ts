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
        let codigo: string;
        let largo:number;
        res['data'].creditos.forEach((item) => {

          codigo = item.codigo.toString();
          largo = codigo.length;

          for(let i = largo ; i < 6 ; i++){
            codigo = "0" + codigo;
          }

          item.codigo = codigo
        });
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

  Crear(
    tipo_credito:number,
    sucursal:number,
    fecha_credito:Date,
    numero:number,
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
    observacion:string
  ) :Observable<any> {

    let params = new HttpParams()
      .set('prtipo',tipo_credito.toString())
      .set('prsucursal',sucursal.toString())
      .set('prfecha',moment(fecha_credito).format("YYYY-MM-DD"))
      .set('prnumero',numero.toString())
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
      .set('probservacion',observacion)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/create.php', params, {headers: headers});

  }

  CrearCronograma(
    id_credito:number,
    monto: number,
    fecha_vencimiento: Date
  ){
    let params = new HttpParams()
      .set('prcredito',id_credito.toString())
      .set('prmonto',monto.toString())
      .set('prfecha',moment(fecha_vencimiento).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/create-cronograma.php', params, {headers: headers});
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
      .set('probservacion',observacion)

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'credito/update.php', params, {headers: headers});

  }

  Proximo( ) : Observable<any> {
    return this.http.get(this.url + 'credito/proximo.php')
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

}
