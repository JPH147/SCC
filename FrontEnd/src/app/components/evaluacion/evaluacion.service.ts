import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';
import * as writtenNumber from 'written-number';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

	public url: string = URL.url;

  constructor(
  	private http: HttpClient
  ) {
    writtenNumber.defaults.lang = 'es'
  }

  ConsultarCapacidad(
  	cliente:number,
  ):Observable<any>{
  	return this.http.get(this.url+'capacidad-pago/read.php',{
  		params: new HttpParams()
  		.set('prcliente',cliente.toString())
  	}).pipe(map(res=>{
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('El cliente no tiene registros de evaluación');
      }
  	}))
  }

  GuardarEvaluacion(
  	id_cliente: number,
  	sueldo_bruto:number,
  	descuentos_oficiales: Array<any>,
  	descuentos_personales: Array<any>,
  	fecha:Date
  ) {
  	
    this.EliminarEvaluacion(id_cliente, fecha).subscribe(res=>{

      this.CrearEvaluacion(id_cliente,sueldo_bruto,1,fecha).subscribe();
      
      descuentos_oficiales.forEach((item)=>{
        if (item.descuento) {
          this.CrearEvaluacion(id_cliente,item.descuento,2,fecha).subscribe()
        }
      })
      
      descuentos_personales.forEach((item)=>{
        if (item.descuento) {
          this.CrearEvaluacion(id_cliente,item.descuento,3,fecha).subscribe()
        }
      })
    })

  }

  CrearEvaluacion(
  	cliente:number,
  	monto: number,
  	tipo:number,
  	fecha:Date
  ): Observable<any> {
    let params = new HttpParams()
    						.set('prcliente',cliente.toString())
								.set('prmonto',monto.toString())
								.set('prtipo',tipo.toString())
								.set('prfecha',moment(fecha).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'capacidad-pago/create.php', params, {headers: headers});
  }

  EliminarEvaluacion(
    cliente:number,
    fecha:Date
  ): Observable<any> {
    let params = new HttpParams()
                .set('prcliente',cliente.toString())
                .set('prfecha',moment(fecha).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'capacidad-pago/delete.php', params, {headers: headers});
  }

  SeleccionarNumero():Observable<any>{
    return this.http.get(this.url+'presupuesto/next.php',{
    })
    .pipe(
      map(res=>{
        if (res['codigo'] === 0) {
          return res['data'];
        } else {
          console.log('No hay datos que mostrar');
        }
      })
    )
  }

  CrearPresupuesto(
    cliente: number,
    tipo: number,
    fecha: Date,
    cuotas: number,
    capital: number,
    tasa: number,
    total: number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prcliente',cliente.toString())
      .set('prcuotas',cuotas.toString())
      .set('prcapital',capital.toString())
      .set('prtasa',tasa.toString())
      .set('prtotal',total.toString())
      .set('prtipo',tipo.toString())
      .set('prfecha',moment(fecha).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'presupuesto/create.php', params, {headers: headers});
  }

  CrearPresupuestoCronograma(
    presupuesto: number,
    monto: number,
    aporte: number,
    fecha: Date
  ): Observable<any> {
    let params = new HttpParams()
                .set('prpresupuesto',presupuesto.toString())
                .set('prmonto',monto.toString())
                .set('praporte',aporte.toString())
                .set('prfecha',moment(fecha).format("YYYY-MM-DD"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'presupuesto/create-cronograma.php', params, {headers: headers});
  }

  CrearPresupuestoProducto(
    presupuesto: number,
    producto: number,
    cantidad: number,
    precio: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('prpresupuesto',presupuesto.toString())
      .set('prproducto',producto.toString())
      .set('prcantidad',cantidad.toString())
      .set('prprecio',precio.toString())

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'presupuesto/create-producto.php', params, {headers: headers});
  }

  GenerarDDJJ(
    nombre_plantilla : string ,
    nombre_archivo : string ,
    nombre : string ,
    dni : string ,
    distrito : string ,
    direccion : string ,
    lugar : string ,
    fecha_letras : Date ,
  ) :Observable <any> {

    let params = new HttpParams()
      .set('prnombreplantilla', nombre_plantilla)
      .set('prnombrearchivo', nombre_archivo)
      .set('prnombre', nombre)
      .set('prdni', dni)
      .set('prdistrito', distrito)
      .set('prdireccion', direccion)
      .set('prlugar', lugar)
      .set('prfecha', moment(fecha_letras).format("DD/MM/YYYY"))
      .set('prfechaletras', moment(fecha_letras).format('LL'))

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post( this.url + 'plantillas/generar-ddjj.php', params, {headers : headers} )

  }

  GenerarAutorizacion(
    nombre_plantilla : string ,
    nombre_archivo : string ,
    cooperativa : string ,
    tipo : string ,
    nombre : string ,
    cargo_estado : string ,
    dni : string ,
    cip : string ,
    codigo : string ,
    direccion : string ,
    tipo_telefono : string , /**/
    telefono : string , /**/
    email : string ,
    ugel_nombre : string ,
    monto_asociado : number ,
    monto_cuota : number ,
    numero_cuotas : number ,
    lugar : string ,
    fecha : Date 
  ) :Observable <any> {

    let params = new HttpParams()
      .set('prnombreplantilla', nombre_plantilla)
      .set('prnombrearchivo', nombre_archivo)
      .set('prcooperativa', cooperativa)
      .set('prtipo', tipo)
      .set('prnombre', nombre)
      .set('prcargoestado', cargo_estado)
      .set('prdni', dni)
      .set('prcip', cip)
      .set('prcodigo', codigo)
      .set('prdireccion', direccion)
      .set('prtipotelefono', tipo_telefono)
      .set('prtelefono', telefono)
      .set('premail', email)
      .set('prugel', ugel_nombre)
      .set('prmontoasociado', monto_asociado.toString())
      .set('prmontocuota', monto_cuota.toString())
      .set('prnumerocuotas', numero_cuotas.toString())
      .set('prlugar', lugar)
      .set('prfechaletras', moment(fecha).format('LL'))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post( this.url + 'plantillas/generar-autorizacion.php', params, {headers : headers} )
  }

  GenerarTransaccion(
    nombre_plantilla : string ,
    nombre_archivo : string ,
    cooperativa : string ,
    cooperativa_direccion : string ,
    cooperativa_direccion_1 : string ,
    cooperativa_direccion_2 : string ,
    cooperativa_cuenta_banco : string ,
    cooperativa_cuenta_numero : string ,
    presidente : string ,
    presidente_dni : string ,
    presidente_direccion : string ,
    nombre : string ,
    cargo : string ,
    dni : string ,
    direccion : string ,
    casilla : string ,
    ugel : string ,
    fecha : Date ,
    dias_premura : number ,
    monto_total : number ,
    monto_cuotas : number ,
    numero_cuotas : number ,
    penalidad_porcentaje : number ,
    penalidad_maxima_cuota : number ,
    banco_nombre : string ,
    cuenta_numero : string ,
    email : string ,
    whatsapp : string ,
    lugar : string ,
    trabajador : string ,
    trabajador_dni : string ,
    trabajador_cargo : string ,
    vendedor : string ,
    vendedor_dni : string ,
    detalle : Array<any>
  ){

    let monto_penalidad : number = monto_total * (100 + penalidad_porcentaje)/100 ;
    let numero_cuotas_penalidad : number = Math.trunc( monto_penalidad / penalidad_maxima_cuota ) ;
    let monto_cuotas_penalidad : number = Math.round( monto_penalidad / numero_cuotas_penalidad ) ;

    monto_penalidad = Math.round( monto_penalidad*100 ) / 100 ;
    monto_cuotas_penalidad = Math.round( monto_cuotas_penalidad *100 ) / 100 ;

    let params = new HttpParams()
      .set('prnombreplantilla',nombre_plantilla )
      .set('prnombrearchivo',nombre_archivo )
      .set('prcooperativa', cooperativa )
      .set('prcooperativadireccion', cooperativa_direccion )
      .set('prcooperativadireccion1', cooperativa_direccion_1 )
      .set('prcooperativadireccion2', cooperativa_direccion_2 )
      .set('prcooperativacuenta_banco', cooperativa_cuenta_banco )
      .set('prcooperativacuenta_numero', cooperativa_cuenta_numero )
      .set('prpresidente', presidente )
      .set('prpresidentedni', presidente_dni )
      .set('prpresidentedireccion', presidente_direccion )
      .set('prnombre',nombre )
      .set('prcargo',cargo )
      .set('prdni',dni )
      .set('prdireccion',direccion )
      .set('prcasilla',casilla )
      .set('prugel', ugel)
      .set('prfechaanterior',moment(fecha).subtract(dias_premura, 'd').format('LL') )
      .set('prfechaletras',moment(fecha).format('LL') )
      .set('prmontototal',monto_total.toString() )
      .set('prmontototalletras', this.EsribirNumero(monto_total,1) )
      .set('prmontocuota', monto_cuotas.toString())
      .set('prmontocuotaletras', this.EsribirNumero(monto_cuotas,1) )
      .set('prnumerocuotas',numero_cuotas.toString() )
      .set('prnumerocuotasletras',this.EsribirNumero(numero_cuotas,2) )
      .set('prfechadia',moment(fecha).date().toString() )
      .set('prfechadialetras', writtenNumber(moment(fecha).date()) )
      .set('prbanconombre',banco_nombre )
      .set('prcuentanumero',cuenta_numero )
      .set('prmontopenalidad',(monto_penalidad).toString() )
      .set('prmontopenalidadletras', this.EsribirNumero(monto_penalidad,1) )
      .set('prnumerocuotaspenalidad',numero_cuotas_penalidad.toString() )
      .set('prnumerocuotaspenalidadletras', this.EsribirNumero(numero_cuotas_penalidad,2) )
      .set('prmontocuotapenalidad',monto_cuotas_penalidad.toString() )
      .set('prmontocuotapenalidadletras', this.EsribirNumero(monto_cuotas_penalidad,1) )
      .set('premail',email)
      .set('prwhatsapp',whatsapp)
      .set('prlugar',lugar)
      .set('prtrabajador',trabajador)
      .set('prtrabajadordni',trabajador_dni)
      .set('prtrabajadorcargo',trabajador_cargo)
      .set('prvendedor',vendedor)
      .set('prvendedordni',vendedor_dni)
      .set('prdetalle',JSON.stringify(detalle));

      console.log(params);

      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      return this.http.post( this.url + 'plantillas/generar-transaccion.php', params, {headers : headers} )
    
  }

  GenerarCompromiso(
    nombre_plantilla : string ,
    nombre_archivo : string ,
    cooperativa : string ,
    nombre : string ,
    dni : string ,
    cip : string ,
    banco : string ,
    cuenta : string ,
    contacto : string ,
    fecha : Date ,
  ) :Observable <any> {

    let params = new HttpParams()
      .set('prnombreplantilla', nombre_plantilla)
      .set('prnombrearchivo', nombre_archivo)
      .set('prcooperativa', cooperativa)
      .set('prnombre', nombre)
      .set('prdni', dni)
      .set('prcip', cip)
      .set('prbanco', banco)
      .set('prcuenta', cuenta)
      .set('prcontacto', contacto)
      .set('prfecha', moment(fecha).format("DD/MM/YYYY"))

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post( this.url + 'plantillas/generar-compromiso.php', params, {headers : headers} )

  }

  GenerarTarjeta(
    nombre_plantilla : string ,
    nombre_archivo : string ,
    nombre : string ,
    dni : string ,
    cip : string ,
    codigo : string ,
    cargo_estado : string ,
    direccion : string ,
    provincia : string ,
    trabajo : string ,
    cuenta_numero : string ,
    lugar : string ,
    celular : string ,
    monto_afiliacion : number ,
  ) :Observable <any> {

    let params = new HttpParams()
      .set('prnombreplantilla', nombre_plantilla)
      .set('prnombrearchivo', nombre_archivo)
      .set('prnombre' , nombre)
      .set('prdni' , dni)
      .set('prcip' , cip)
      .set('prcodigo' , codigo)
      .set('prcargoestado' , cargo_estado)
      .set('prdireccion' , direccion)
      .set('prprovincia' , provincia)
      .set('prtrabajo' , trabajo)
      .set('prcuentanumero' , cuenta_numero)
      .set('prlugar' , lugar)
      .set('prcelular' , celular)
      .set('prmontoafiliacion' , monto_afiliacion.toString());

    console.log(params);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post( this.url + 'plantillas/generar-tarjeta.php', params, {headers : headers} )
    
  }

  ObtenerArchivo(
    nombre:string
  ): Observable<Blob>{

    let params = new HttpParams()
    .set('prarchivo', nombre)

    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')

    return this.http.post(this.url + 'plantillas/enviar-archivo.php', params, {
      responseType: "blob"
    });
  }

  // Se obtiene la información de la cooperativa
  ObtenerInformacion(){
    return this.http.get(this.url+'plantillas/consultar-informacion.php',{
    })
    .pipe(
      map(res=>{
        if (res['codigo'] === 0) {
          return res['data'];
        } else {
          console.log('No hay datos que mostrar');
        }
      })
    )
  }

  EsribirNumero( numero : number, tipo : number ) :string {
    // tipo es para determinar si va con el 00/100(1) o no(2)
    let entero : number ;
    let decimal : number ;
    let decimal_corregido : string ;

    entero = Math.trunc(numero);

    decimal = Math.trunc( ( numero-entero ) * 100 );

    if( tipo == 1 ) {
      if(decimal>0){
        decimal_corregido =  " con " + decimal + "/100 SOLES";
      } else {
        decimal_corregido = " con 00/100 SOLES";
      }
    } else {
      decimal_corregido = "" ;
    }

    return writtenNumber(entero).toUpperCase() + decimal_corregido;

  }

}