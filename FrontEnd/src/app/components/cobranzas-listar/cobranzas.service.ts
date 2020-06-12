import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL, URLIMAGENES } from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CobranzasService {

  public url: string = URL.url;
  public url_imagenes: string = URLIMAGENES.urlimages;

  constructor(
    private http: HttpClient
  ) { }

  ListarCronograma(
    cliente : string,
    sede : string,
    subsede : string,
    institucion : string,
    tipo : number, // 1. Afiliación, 2. Préstamo, 3. Venta
    fecha_inicio : Date,
    fecha_fin : Date,
    estado : number, // 1. Pendiente, 2. Pagado
    numero_pagina : number,
    total_pagina : number,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prcliente', cliente)
      .set('prsede', sede)
      .set('prsubsede', subsede)
      .set('prinstitucion', institucion)
      .set('prtipo', tipo.toString())
      .set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD"))
      .set('prestado', estado.toString())
      .set('prpagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())

    return this.http.get(this.url + 'cobranza/read-cronograma.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarPNP(
    sede : number ,
    fecha_inicio : Date ,
    fecha_fin : Date
  ){
    // Se envía null para que se muestren las deudas hasta la fecha
    let params = new HttpParams()
      .set('prsede', sede.toString() )
      // .set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD") );

    return this.http.get(this.url + 'cobranza/read-pnp.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ListarPNPClientes(
    sede : number ,
    fecha_inicio : Date ,
    fecha_fin : Date
  ){
    // Se envía null para que se muestren las deudas hasta la fecha
    let params = new HttpParams()
      .set('prsede', sede.toString() )
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD") );

    return this.http.get(this.url + 'cobranza/read-pnp-clientes.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  VerificarPagoSede(
    sede : number,
    fecha_fin : Date
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prsede', sede.toString())
      .set('prfecha', moment(fecha_fin).format("YYYY-MM-DD"))

    return this.http.get(this.url + 'cobranza/verificar-pago-sede.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return 0;
      }
    }));
  }

  // Prueba de enviar array a PHP
  Generar_PNP(
    nombre_archivo: string,
    informacion : Array<any>
  ) : Observable <any> {

    let params = new HttpParams()
      .set('prarchivo', nombre_archivo)
      .set('contenido', informacion.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/generar-pnp.php', params, {headers: headers});
  }

  MoverArchivoPNP(
    id_cobranza: number,
    nameimg: string,
    nombre: string,
  ): Observable <any> {

    if (!nameimg) {
      return of({codigo:1, data:"",mensaje:""});
    }

    let params = new  HttpParams()
      .set('prcobranza', id_cobranza.toString())
      .set('nameimg', nameimg.trim())
      .set('tipodoc', nombre.trim());

    // console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post( this.url + 'cobranza/upload-planilla.php', params , { headers : headers } )
  }

  CrearCabecera(
    sede : number,
    tipo_pago : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    cantidad : number,
    monto : number,
    archivo : string,
    detalle : Array<any>
  ){

    let params = new HttpParams()
      .set('prsede', sede.toString())
      .set('prtipopago', tipo_pago.toString())
      // .set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD"))
      .set('prcantidad', cantidad.toString())
      .set('prmonto', monto.toString())
      .set('prarchivo', archivo)
      .set('prdetalle', JSON.stringify(detalle) );

      // console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/create-archivos-cabecera.php', params, {headers: headers});

  }

  CrearDetalle(
    id_cobranza : number,
    cliente : number,
    codigo : string,
    monto : number,
  ){
    let params = new HttpParams()
      .set('prcobranza', id_cobranza.toString())
      .set('prcliente', cliente.toString())
      .set('prcodofin', codigo.toString())
      .set('prmonto', monto.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cobranza/create-archivos-detalle.php', params, {headers: headers});
  }

  CrearCabeceraPago(
    id_cabecera : number ,
    fecha_pago : Date ,
    monto : number ,
    detalle : Array<any>
  ) :Observable<any> {

    let params = new HttpParams()
      .set('prcobranza', id_cabecera.toString())
      .set('prfechapago', moment(fecha_pago).format("YYYY-MM-DD"))
      .set('prmontopagado', monto.toString())
      .set('prdetalle', JSON.stringify(detalle) );

      console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'cobranza/create-archivos-cabecera-pago.php', params, {headers: headers});
  }

  EliminarCobranzaPlanilla(
    id_cobranza : number 
  ) : Observable <any> {

    let params = new HttpParams()
      .set('prid', id_cobranza.toString());

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/delete-cobranza-planilla.php', params, {headers: headers});
  }

  ListarCobranzas(
    numero_pagina : number,
    total_pagina : number,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prpagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())

    return this.http.get(this.url + 'cobranza/read-planilla.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ListarCobranzasDirectas(
    cliente : string ,
    banco : number ,
    operacion : string ,
    fecha_inicio : Date ,
    fecha_fin : Date ,
    numero_pagina : number ,
    total_pagina : number ,
    orden : string ,
  ){
    let params = new HttpParams()
      .set('prcliente', cliente)
      .set('prbanco', banco.toString())
      .set('properacion', operacion)
      .set('prfechainicio', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prfechafin', moment(fecha_fin).format("YYYY-MM-DD"))
      .set('prnumeropagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())
      .set('prorden', orden);

    // console.log(params);

    return this.http.get(this.url + 'cobranza/read-directa.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  SeleccionarCobranzaDirecta(
    id_cobranza : number
  ) : Observable<any> {
    let params = new HttpParams()
      .set('prid', id_cobranza.toString());

    return this.http.get(this.url + 'cobranza/read-directaxId.php', {params})
      .pipe(map(res => {
        if (res['codigo'] === 0) {
          return res['data'];
        } else {
          console.log('No hay datos que mostrar');
          return [];
        }
      })
    );
  }

  SeleccionarCobranzaPlanilla(
    id_cobranza : number
  ) : Observable<any> {

    let params = new HttpParams()
      .set('prcabecera', id_cobranza.toString());

    return this.http.get(this.url + 'cobranza/read-cobranzas-archivosxId.php', {params})
      .pipe(map(res => {
        if (res['codigo'] === 0) {
          return { cabecera: res['data'], detalle: res['mensaje'] };
        } else {
          console.log('No hay datos que mostrar', res);
          return false;
        }
      })
    );

  }

  ObtenerArchivo(
    nombre:string
  ): Observable<Blob>{

    let params = new HttpParams()
    .set('prarchivo', nombre)

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

    return this.http.post(this.url + 'cobranza/enviar-archivo.php', params, {
      responseType: "blob"
    });
  }

  ListarCuentas() {
    return this.http.get(this.url + 'cobranza/read-cuenta.php')
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ListarPosiblesCuotas(
    id_cliente : number ,
    monto : number ,
    considerar_solo_directas : boolean ,
  ):Observable<any>{

    let params = new HttpParams()
      .set('prcliente', id_cliente.toString())
      .set('prmonto', monto.toString())
      .set('prsolodirectas', considerar_solo_directas ? "1" : "0" );

    return this.http.get( this.url + 'cobranza/read-posibles-cuotas.php', { params } )
    .pipe(map(res=>{
      if(res['codigo']===0){
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ListarPosiblesCuotasSinDirecta(
    id_cliente : number ,
    monto : number ,
    considerar_solo_directas : boolean ,
    id_cobranza : number ,
  ):Observable<any>{

    let params = new HttpParams()
      .set('prcliente', id_cliente.toString())
      .set('prmonto', monto.toString())
      .set('prsolodirectas', considerar_solo_directas ? "1" : "0" )
      .set('prcobranza', id_cobranza.toString());

    return this.http.get( this.url + 'cobranza/read-posibles-cuotas-SIN-directa.php', { params } )
    .pipe(map(res=>{
      if(res['codigo']===0){
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ListarCobranzasRealizadasxPlanilla(
    cabecera : number ,
    id_cliente : number ,
    monto : number ,
  ):Observable<any>{

    let params = new HttpParams()
      .set('prcabecera', cabecera.toString())
      .set('prcliente', id_cliente.toString())
      .set('prmonto', monto.toString());

    // console.log(params);

    return this.http.get( this.url + 'cobranza/read-cobranzas-realizadas-planilla.php', { params } )
    .pipe(map(res=>{
      if(res['codigo']===0){
        return res['data'].cuotas;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  CrearCobranzaDirecta(
    fecha : Date,
    cliente : number,
    cuenta : string,
    operacion : string,
    monto : number,
    considerar_solo_directas : boolean ,
    archivo : string,
    observaciones : string,
    detalle : Array<any>
  ){
    let params = new HttpParams()
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prcliente', cliente.toString())
      .set('prcuenta', cuenta)
      .set('properacion', operacion)
      .set('prmonto', monto.toString())
      .set('prsolodirectas', considerar_solo_directas ? "1" : "0" )
      .set('prarchivo', archivo)
      .set('probservaciones', observaciones)
      .set('prdetalle', JSON.stringify(detalle) );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/create-directa.php', params, {headers: headers});
  }

  ActualizarCobranzaDirecta(
    id_cobranza : number,
    fecha : Date,
    cliente : number,
    cuenta : string,
    operacion : string,
    monto : number,
    considerar_solo_directas : boolean ,
    archivo : string,
    observaciones : string,
    detalle : Array<any>
  ){
    let params = new HttpParams()
      .set('prid', id_cobranza.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prcliente', cliente.toString())
      .set('prcuenta', cuenta)
      .set('properacion', operacion)
      .set('prmonto', monto.toString())
      .set('prsolodirectas', considerar_solo_directas ? "1" : "0" )
      .set('prarchivo', archivo)
      .set('probservaciones', observaciones)
      .set('prdetalle', JSON.stringify(detalle) );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/update-directa.php', params, {headers: headers});
  }

  CrearDetalleCobranza(
    cobranza_directa : number,
    cobranza_archivos : number,
    cobranza_judicial : number,
    credito_cronograma : number,
    venta_cronograma : number,
    monto : string,
    fecha : Date
  ){
    let params = new HttpParams()
      .set('prcobranzadirecta', cobranza_directa.toString()  )
      .set('prcobranzaarchivos', cobranza_archivos.toString()  )
      .set('prcobranzajudicial', cobranza_judicial.toString()  )
      .set('prcreditocronograma', credito_cronograma.toString()  )
      .set('prventacronograma', venta_cronograma.toString()  )
      .set('prmonto', monto.toString() )
      .set('prfecha', moment(fecha).format("YYYY-MM-DD") );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/create-detalle.php', params, {headers: headers});
  }

  ListarPagosxCuota(
    id_tipo : number , // Puede ser crédito o venta
    id_cuota : number , // Puede ser crédito o venta
    numero_pagina : number ,
    total_pagina : number
  ){
    let params = new HttpParams()
      .set('prtipo', id_tipo.toString() )
      .set('prcuota', id_cuota.toString() )
      .set('prpagina', numero_pagina.toString() )
      .set('prtotalpagina', total_pagina.toString() );

    return this.http.get(this.url + 'cobranza/read-pagos-transacciones.php', { params } )
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  EliminarCobranzaDirecta(
    id_cobranza_directa : number 
  ) :Observable<any> {

    let params = new HttpParams()
      .set("prid", id_cobranza_directa.toString())

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + "cobranza/delete-cobranza-directa.php" , params , { headers : headers } );
  }

  BuscarNumeroOperacion(
    numero_operacion : string ,
  ) :Observable<boolean> {
    let params = new HttpParams()
      .set('properacion', numero_operacion );

    return this.http.get(this.url + 'cobranza/buscar-operacion.php', { params } )
    .pipe(map(res => {
      if (res['data'] == 1) {
        return true;
      } else {
        // console.log('No hay datos que mostrar');
        return false;
      }
    }));
  }

  CrearArchivoPNP(
    codigo_cooperativa : string ,
    nombre_archivo : string ,
    detalle : Array<any>
  ){
    let params = new HttpParams()
      .set('prcodigo', codigo_cooperativa )
      .set('prarchivo', nombre_archivo )
      .set('prdetalle', JSON.stringify(detalle) ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/create-archivo-pnp.php', params, {headers: headers});
  }

  ActualizarCuota(
    tipo : number,
    id_cobranza : Date,
    fecha : number,
    tipo_pago : string,
  ){
    let params = new HttpParams()
      .set('prtipo', tipo.toString())
      .set('prid', id_cobranza.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prtipopago', tipo_pago);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cobranza/update-cuota.php', params, {headers: headers});
  }

  // Esta función muestra las deudas por cliente
  ListarCobranzasxcliente(
    cliente : string,
    sede : string,
    subsede : string,
    institucion : string,
    tipo_pago : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    nivel_mora : number,
    numero_pagina : number,
    total_pagina : number,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prcliente', cliente)
      .set('prsede', sede)
      .set('prsubsede', subsede)
      .set('prinstitucion', institucion)
      .set('prtipopago', tipo_pago.toString())
      .set('prfechainicio', fecha_inicio ? moment(fecha_inicio).format("YYYY-MM-DD") : "")
      .set('prfechafin', fecha_fin ? moment(fecha_fin).format("YYYY-MM-DD") : "")
      .set('prnivelmora', nivel_mora.toString())
      .set('prpagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())

    return this.http.get(this.url + 'cobranza/read-cobranzasxcliente.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarCobranzasxclienteUnlimited(
    nombre_archivo : string,
    cliente : string,
    sede : string,
    subsede : string,
    institucion : string,
    tipo_pago : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    nivel_mora : number,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prarchivo', nombre_archivo)  
      .set('prcliente', cliente)
      .set('prsede', sede)
      .set('prsubsede', subsede)
      .set('prinstitucion', institucion)
      .set('prtipopago', tipo_pago.toString())
      .set('prfechainicio', fecha_inicio ? moment(fecha_inicio).format("YYYY-MM-DD") : null)
      .set('prfechafin', fecha_fin ? moment(fecha_fin).format("YYYY-MM-DD") : null)
      .set('prnivelmora', nivel_mora.toString());

    return this.http.get(this.url + 'cobranza/read-cobranzasxcliente-unlimited.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        console.log(res);
        return false;
      }
    }));
  }

  // Esta función muestra las cuotas por cliente
  ListarCronogramaxCliente(
    cliente : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    numero_pagina : number,
    total_pagina : number,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prcliente', cliente.toString())
      .set('prfechainicio', fecha_inicio ? moment(fecha_inicio).format("YYYY-MM-DD") : "")
      .set('prfechafin', fecha_fin ? moment(fecha_fin).format("YYYY-MM-DD") : "")
      .set('prpagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())

    return this.http.get(this.url + 'cobranza/read-cronogramaxcliente.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar', res);
        return res;
      }
    }));
  }
  
  // Esta función muestra las cuotas vencidas por cliente
  ListarCronogramaVencidoxCliente(
    cliente : number,
    numero_pagina : number,
    total_pagina : number,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prcliente', cliente.toString())
      .set('prpagina', numero_pagina.toString())
      .set('prtotalpagina', total_pagina.toString())

    return this.http.get(this.url + 'cobranza/read-cronograma-vencidosxcliente.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarCobranzasxclienteMorosos(
    cliente : string,
    sede : string,
    subsede : string,
    institucion : string,
    tipo_pago : number,
    fecha_inicio : Date,
    fecha_fin : Date,
  ) : Observable <any> {
    let params = new HttpParams()
      .set('prcliente', cliente)
      .set('prsede', sede)
      .set('prsubsede', subsede)
      .set('prinstitucion', institucion)
      .set('prtipopago', tipo_pago.toString())
      .set('prfechainicio', fecha_inicio ? moment(fecha_inicio).format("YYYY-MM-DD") : "")
      .set('prfechafin', fecha_fin ? moment(fecha_fin).format("YYYY-MM-DD") : "") ;

    return this.http.get(this.url + 'cobranza/read-morosidad.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar',res);
        return false;
      }
    }));
  }
}
