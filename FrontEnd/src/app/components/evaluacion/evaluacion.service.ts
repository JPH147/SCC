	import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL,URLIMAGENES} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

	public url: string = URL.url;

  constructor(
  	private http: HttpClient
  ) { }

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

  SeleccionarNumero(
    ):Observable<any>{
    return this.http.get(this.url+'presupuesto/next.php',{
    })
    .pipe(
      map(res=>{
        if (res['codigo'] === 0) {
          return res['data'];
        } else {
          console.log('Error al importar los datos, revisar servicio');
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
}