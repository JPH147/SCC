import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {delay, map, retry, retryWhen, take} from 'rxjs/operators';
import {URL} from 'src/app/core/servicios/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CobranzaJudicialService {

  public url: string = URL.url;

  constructor(
    private http: HttpClient
  ) { }

  Listar(
    expediente:string,
    distrito:string,
    juzgado:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    numero_pagina:number,
    total_pagina:number,
    orden:string
  ): Observable<any> {
    let params = new HttpParams()
      .set('prexpediente',expediente)
      .set('prdistrito',distrito)
      .set('prjuzgado',juzgado)
      .set('prdni',dni)
      .set('prnombre',nombre)
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString())
      .set('prpagina',numero_pagina.toString())
      .set('prtotalpagina',total_pagina.toString())
      .set('prorden',orden);

    return this.http.get(this.url + 'procesojudicial/read.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarxId(
    id_proceso : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid',id_proceso.toString() );

    return this.http.get(this.url + 'procesojudicial/readxId.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarAnteriorxId(
    id_proceso : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid',id_proceso.toString() );

    return this.http.get(this.url + 'procesojudicial/readanteriorxId.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return false;
      }
    }));
  }

  ListarDetallexProcesoxId(
    id_proceso : number
  ){
    let params = new HttpParams()
      .set('prid',id_proceso.toString());

    return this.http.get(this.url + 'procesojudicial/readdetallexprocesoxId.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].procesos[0];
      } else {
        console.log('No hay datos que mostrar',res);
        return false;
      }
    }));
  }

  ListarDetallexProceso(
    id_proceso : number
  ){
    let params = new HttpParams()
      .set('prid',id_proceso.toString());

    return this.http.get(this.url + 'procesojudicial/readdetallexproceso.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].procesos;
      } else {
        console.log('No hay datos que mostrar',res);
        return false;
      }
    }));
  }

  ListarDetalleAnteriorxProceso(
    id_proceso : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid',id_proceso.toString());

    return this.http.get(this.url + 'procesojudicial/readdetalleanteriorxproceso.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0 && res['data'].procesos) {
        return res['data'].procesos;
      } else {
        // console.log('No hay datos que mostrar',res);
        return false;
      }
    }));
  }

  CrearProcesoCabecera(
    id_venta:number,
    id_credito:number,
    expediente: string,
    instancia: number,
    juez: string,
    especialista: string,
    fecha_inicio: Date,
    sumilla: string ,
    numero_cuotas : number ,
    total : number ,
  ){
    let params = new HttpParams()
      .set('prventa', id_venta.toString())
      .set('prcredito', id_credito.toString())
      .set('prexpediente', expediente)
      .set('prinstancia', instancia.toString())
      .set('prjuez', juez.toString() )
      .set('prespecialista', especialista.toString() )
      .set('prfecha', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prsumilla', sumilla )
      .set('prnumerocuotas', numero_cuotas.toString() )
      .set('prtotal', total.toString() );    
    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-cabecera.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return res['data'];
        } else {
          return false;
        }
      })
    );
  }

  CrearProcesoDetalle(
    id_proceso:number,
    tipo_documento:string,
    fecha:Date,
    trabajador:number,
    estado:number,
    numero: number,
    sumilla: string,
    archivo: string,
    comentarios: string,
    fecha_notificacion_demandado : Date ,
    fecha_notificacion_cooperativa : Date ,
    fecha_notificacion_retorno : Date ,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString())
      .set('prdocumento', tipo_documento)
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prtrabajador', trabajador.toString())
      .set('prestado', estado.toString())
      .set('prnumero', numero.toString())
      .set('prsumilla', sumilla)
      .set('prarchivo', archivo)
      .set('prcomentarios', comentarios )
      .set('prfechanotificaciondemandado', fecha_notificacion_demandado ? moment(fecha_notificacion_demandado).format("YYYY-MM-DD") : "0")
      .set('prfechanotificacioncooperativa', fecha_notificacion_cooperativa ? moment(fecha_notificacion_cooperativa).format("YYYY-MM-DD") : "0")
      .set('prfechanotificacionretorno', fecha_notificacion_retorno ? moment(fecha_notificacion_retorno).format("YYYY-MM-DD") : "0")

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-detalle.php', params, {headers: headers})
    .pipe(
      map(res=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ActualizarProcesoCobranza(
    id_proceso:number,
    fecha: Date,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString() )
      .set('prfecha', moment(fecha).format("YYYY-MM-DD") ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-cobranza.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        console.log(res)
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  CrearProcesoCronograma(
    id_proceso:number,
    monto_cuota:number,
    fecha:Date,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString())
      .set('prcuota', monto_cuota.toString())
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"));

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-cronograma.php', params, {headers: headers})
    .pipe(
      map(res=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ActualizarProcesoCabecera(
    id_proceso:number,
    expediente: string,
    instancia: number,
    juez: number,
    especialista: number,
    fecha_inicio: Date,
    sumilla: string ,
    numero_cuotas : number ,
    total : number ,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString() )
      .set('prexpediente', expediente)
      .set('prinstancia', instancia.toString() )
      .set('prjuez', juez.toString() )
      .set('prespecialista', especialista.toString() )
      .set('prfecha', moment(fecha_inicio).format("YYYY-MM-DD") )
      .set('prsumilla', sumilla )
      .set('prnumerocuotas', numero_cuotas.toString() )
      .set('prtotal', total.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-cabecera.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ActualizarProcesoTraslado(
    id_proceso_nuevo : number ,
    id_proceso_antiguo : number ,
  ){
    let params = new HttpParams()
      .set('prprocesonuevo', id_proceso_nuevo.toString() )
      .set('prprocesoantiguo', id_proceso_antiguo.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-traslado.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ActualizarProcesoDetalle(
    id_proceso_detalle:number,
    tipo_documento:string,
    fecha:Date,
    trabajador: number,
    estado: number,
    numero: number,
    sumilla: string,
    archivo: string,
    comentarios: string,
    fecha_notificacion_demandado : Date ,
    fecha_notificacion_cooperativa : Date ,
    fecha_notificacion_retorno : Date ,
  ){
    let params = new HttpParams()
      .set('prproceso', id_proceso_detalle.toString())
      .set('prdocumento', tipo_documento)
      .set('prfecha', moment(fecha).format("YYYY-MM-DD"))
      .set('prtrabajador', trabajador.toString())
      .set('prestado', estado.toString())
      .set('prnumero', numero.toString())
      .set('prsumilla', sumilla)
      .set('prarchivo', archivo)
      .set('prcomentarios', comentarios )
      .set('prfechanotificaciondemandado', fecha_notificacion_demandado ? moment(fecha_notificacion_demandado).format("YYYY-MM-DD") : "0")
      .set('prfechanotificacioncooperativa', fecha_notificacion_cooperativa ? moment(fecha_notificacion_cooperativa).format("YYYY-MM-DD") : "0")
      .set('prfechanotificacionretorno', fecha_notificacion_retorno ? moment(fecha_notificacion_retorno).format("YYYY-MM-DD") : "0")

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-detalle.php', params, {headers: headers})
    .pipe(
      map(res=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  EliminarProcesoCabecera(
    id_proceso:number,
  ){
    let params = new HttpParams()
      .set('prid', id_proceso.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/eliminar-cabecera.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  EliminarProcesoDetalle(
    id_proceso:number,
  ){
    let params = new HttpParams()
      .set('prid', id_proceso.toString() );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/eliminar-detalle.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ObtenerProximoNumero(
    id_proceso:number,
    tipo_documento:string,
    id_proceso_detalle : number
  ): Observable<any> {
    let params = new HttpParams()
      .set('prproceso',id_proceso.toString())
      .set('prdocumento',tipo_documento)
      .set('prprocesodetalle',id_proceso_detalle.toString()) ;
  
    // console.log(params);
    return this.http.get(this.url + 'procesojudicial/read-proximo.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar');
        return 0;
      }
    }));
  }

  CrearProcesoJudicialTraslado(
    id_proceso:number,
    expediente: string,
    instancia: number,
    juez: number,
    especialista: number,
    sumilla: string
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prproceso', id_proceso.toString())
      .set('prexpediente', expediente)
      .set('prinstancia', instancia.toString())
      .set('prjuez', juez.toString() )
      .set('prespecialista', especialista.toString() )
      .set('prsumilla', sumilla ) ;
      
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-traslado.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          return true;
        } else {
          return false;
        }
      })
    );
  }

  ObtenerFechaAntigua(): Observable<any> {
    return this.http.get(this.url + 'procesojudicial/readfecha.php')
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return moment(res['data'].fecha_inicio).toDate();
      } else {
        console.log('No hay datos que mostrar');
        return new Date();
      }
    }));
  }

  ListarV2(
    instancia:number,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    orden:string
  ): Observable<any> {
    let params = new HttpParams()
      .set('prinstancia',instancia.toString())
      .set('prexpediente',expediente)
      .set('prdni',dni)
      .set('prnombre',nombre)
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString())
      .set('prorden',orden);

    return this.http.get(this.url + 'procesojudicial/readV2.php', {params})
    .pipe(
      retry(20),
      map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarV4(
    distrito:string,
    instancia:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    orden:string
  ): Observable<any> {
    let params = new HttpParams()
      .set('prdistrito',distrito )
      .set('prinstancia',instancia )
      .set('prexpediente',expediente )
      .set('prdni',dni )
      .set('prnombre',nombre )
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD') )
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD') )
      .set('prestado',estado.toString() )
      .set('prorden',orden ) ;

    return this.http.get(this.url + 'procesojudicial/readV4.php', {params})
    .pipe(
      retry(20),
      map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar', res);
        return res;
      }
    }));
  }

  ListarInstanciasV4(
    distrito:string,
    instancia:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prdistrito',distrito )
      .set('prinstancia',instancia )
      .set('prexpediente',expediente )
      .set('prdni',dni )
      .set('prnombre',nombre )
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD') )
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD') )
      .set('prestado',estado.toString() ) ;

    return this.http.get(this.url + 'procesojudicial/read-instanciasV4.php', {params})
    .pipe(
      retry(20),
      map(res => {
      if (res['codigo'] === 0) {
        return res['data'];
      } else {
        console.log('No hay datos que mostrar', res);
        return [];
      }
    }));
  }
  
  ListarDistritosV4(
    distrito:string,
    instancia:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prdistrito',distrito )
      .set('prinstancia',instancia )
      .set('prexpediente',expediente )
      .set('prdni',dni )
      .set('prnombre',nombre )
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD') )
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD') )
      .set('prestado',estado.toString() ) ;

    return this.http.get(this.url + 'procesojudicial/read-distritosV4.php', {params})
    .pipe(
      retry(20),
      map(res => {
      if (res['codigo'] === 0) {
        return res['data'] ;
      } else {
        console.log('No hay datos que mostrar', res);
        return [];
      }
    }));
  }

  ListarInstancias(
    distrito:number,
    juzgado:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prdistrito',distrito.toString())
      .set('prjuzgado',juzgado)
      .set('prexpediente',expediente)
      .set('prdni',dni)
      .set('prnombre',nombre)
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString()) ;

    return this.http.get(this.url + 'procesojudicial/readprocesosinstancias.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  ListarDistritos(
    distrito:string,
    juzgado:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('prdistrito',distrito)
      .set('prjuzgado',juzgado)
      .set('prexpediente',expediente)
      .set('prdni',dni)
      .set('prnombre',nombre)
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString()) ;

    return this.http.get(this.url + 'procesojudicial/readprocesosdistritos.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return res;
      }
    }));
  }

  CrearProcesoTransaccionesMultiples(
    id_cliente:number,
    expediente: string,
    instancia: number,
    juez: string,
    especialista: string,
    fecha_inicio: Date,
    sumilla: string ,
    numero_cuotas : number ,
    total : number ,
    transacciones : Array<any> ,
  ){
    let params = new HttpParams()
      .set('prcliente', id_cliente.toString())
      .set('prexpediente', expediente)
      .set('prinstancia', instancia.toString())
      .set('prjuez', juez.toString() )
      .set('prespecialista', especialista.toString() )
      .set('prfecha', moment(fecha_inicio).format("YYYY-MM-DD"))
      .set('prsumilla', sumilla )
      .set('prnumerocuotas', numero_cuotas.toString() )
      .set('prtotal', total.toString() )
      .set('prtransacciones', JSON.stringify( transacciones ) );    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-multiple-transacciones.php', params, {headers: headers})
    .pipe(
      map((res)=>{
        if(res['codigo']==0){
          transacciones.map(item=>{
            this.CrearTransacciones(res['data'], item.id_tipo, item.id).subscribe() ;
          })
          return res['data'];
        } else {
          return false;
        }
      })
    );
  }

  CrearTransacciones(
    proceso : number ,
    tipo : number ,
    transaccion : number ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prproceso', proceso.toString())
      .set('prtipo', tipo.toString())
      .set('prtransaccion', transaccion.toString() ) ;    

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-transacciones.php', params, {headers: headers}) ;
  } 

  ListarProcesosxTransaccion(
    tipo : number , // 1. Préstamo, 2. Venta
    transaccion : number
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prtipotransaccion',tipo.toString())
      .set('prtransaccion',transaccion.toString()) ;

    return this.http.get(this.url + 'procesojudicial/readxtransaccion.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].transacciones;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ListarDocumentosTransaccionxProceso(
    id_proceso : number , // 1. Préstamo, 2. Venta
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prid',id_proceso.toString()) ;

    return this.http.get(this.url + 'procesojudicial/read-documentostransaccionesxproceso.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].documentos;
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }));
  }

  ContarProcesoJudicialExpediente(
    expediente : string
  ) : Observable<number> {
    let params = new HttpParams()
      .set( 'prexpediente', expediente ) ;

    return this.http.get(this.url + 'procesojudicial/verificar-procesojudicial.php', { params } )
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'] ;
      } else {
        console.log('No hay datos que mostrar');
        return 0 ;
      }
    }));
  }

  ContarProcesosJudiciales(
    fecha_inicio : Date ,
    fecha_fin : Date ,
    estado : number
  ) : Observable<number> {
    let params = new HttpParams()
      .set('prfechainicio', moment(fecha_inicio).format('YYYY-MM-DD'))
      .set('prfechafin',moment(fecha_fin).format('YYYY-MM-DD'))
      .set('prestado',estado.toString()) ;

    return this.http.get(this.url + 'procesojudicial/read-total.php', {params})
    .pipe(
      retryWhen(errors => errors.pipe(delay(1000), take(10))),
      map(res => {
      if (res['codigo'] === 0) {
        return (res['mensaje'] as number);
      } else {
        console.log('No hay datos que mostrar');
        return 0;
      }
    }));
  }

  ListarProcesosJudicialesNotificacionesxProceo(
    id_proceso : number ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prproceso',id_proceso.toString()) ;

    return this.http.get(this.url + 'procesojudicial/read-notificacionesxproceso.php', {params})
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar', res);
        return null;
      }
    }));
  }

  CrearNotificaciones(
    proceso : number ,
    codigo : string ,
    destinatario : string ,
    anexos : string ,
    juzgado_fecha_resolucion : Date ,
    juzgado_fecha_notificacion : Date ,
    juzgado_fecha_envio : Date ,
    juzgado_fecha_recepcion : Date ,
    central_fecha_notificacion : Date ,
    central_fecha_cargo : Date ,
    comentarios : string ,
    observacion : string ,
    archivo : string ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prproceso", proceso.toString() )
      .set("prcodigo", codigo )
      .set("prdestinatario", destinatario )
      .set("pranexos", anexos )
      .set("prjuzgadofecharesolucion", juzgado_fecha_resolucion ? moment(juzgado_fecha_resolucion).format("YYYY-MM-DD") : null )
      .set("prjuzgadofechanotificacion", juzgado_fecha_notificacion ? moment(juzgado_fecha_notificacion).format("YYYY-MM-DD") : null )
      .set("prjuzgadofechaenvio", juzgado_fecha_envio ? moment(juzgado_fecha_envio).format("YYYY-MM-DD") : null )
      .set("prjuzgadofecharecepcion", juzgado_fecha_recepcion ? moment(juzgado_fecha_recepcion).format("YYYY-MM-DD") : null )
      .set("prcentralfechanotificacion", central_fecha_notificacion ? moment(central_fecha_notificacion).format("YYYY-MM-DD") : null )
      .set("prcentralfechacargo", central_fecha_cargo ? moment(central_fecha_cargo).format("YYYY-MM-DD") : null )
      .set("prcomentarios", comentarios )
      .set("probservacion", observacion )
      .set("prarchivo", archivo ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/crear-notificacion.php', params, {headers: headers})
    .pipe(map(resultado => {
      if (resultado['codigo']=== 0) {
        return true ;
      } else {
        return false ;
      }
    })) ;
  } 

  ActualizarNotificaciones(
    id_proceso_notificacion : number ,
    codigo : string ,
    destinatario : string ,
    anexos : string ,
    juzgado_fecha_resolucion : Date ,
    juzgado_fecha_notificacion : Date ,
    juzgado_fecha_envio : Date ,
    juzgado_fecha_recepcion : Date ,
    central_fecha_notificacion : Date ,
    central_fecha_cargo : Date ,
    comentarios : string ,
    observacion : string ,
    archivo : string ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prprocesonotificacion", id_proceso_notificacion.toString() )
      .set("prcodigo", codigo )
      .set("prdestinatario", destinatario )
      .set("pranexos", anexos )
      .set("prjuzgadofecharesolucion", juzgado_fecha_resolucion ? moment(juzgado_fecha_resolucion).format("YYYY-MM-DD") : "0" )
      .set("prjuzgadofechanotificacion", juzgado_fecha_notificacion ? moment(juzgado_fecha_notificacion).format("YYYY-MM-DD") : "0" )
      .set("prjuzgadofechaenvio", juzgado_fecha_envio ? moment(juzgado_fecha_envio).format("YYYY-MM-DD") : "0" )
      .set("prjuzgadofecharecepcion", juzgado_fecha_recepcion ? moment(juzgado_fecha_recepcion).format("YYYY-MM-DD") : "0" )
      .set("prcentralfechanotificacion", central_fecha_notificacion ? moment(central_fecha_notificacion).format("YYYY-MM-DD") : "0" )
      .set("prcentralfechacargo", central_fecha_cargo ? moment(central_fecha_cargo).format("YYYY-MM-DD") : "0" )
      .set("prcomentarios", comentarios )
      .set("probservacion", observacion )
      .set("prarchivo", archivo ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-notificacion.php', params, {headers: headers})
    .pipe(map(resultado => {
      if (resultado['codigo']=== 0) {
        return true ;
      } else {
        return false ;
      }
    })) ;
  } 

  EliminarNotificaciones(
    id_proceso_notificacion : number ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prprocesonotificacion", id_proceso_notificacion.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/eliminar-notificacion.php', params, {headers: headers})
    .pipe(map(resultado => {
      if (resultado['codigo']=== 0) {
        return true ;
      } else {
        return false ;
      }
    })) ;
  } 

  DevolverAnexosProceso(
    proceso : number ,
    fecha : Date ,
    comentarios : string ,
    archivo : string ,
  ) :Observable<any> {
    let params = new HttpParams()
      .set('prproceso', proceso.toString() )
      .set('prfecha', moment(fecha).format("YYYY-MM-DD") )
      .set('prcomentarios', comentarios )
      .set('prarchivo', archivo ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'procesojudicial/actualizar-devolucion-anexos.php', params, {headers: headers})
    .pipe(map(resultado => {
      if (resultado['codigo']=== 0) {
        return true ;
      } else {
        return false ;
      }
    })) ;
  } 
}
