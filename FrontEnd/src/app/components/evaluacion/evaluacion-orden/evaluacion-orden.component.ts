import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {EvaluacionService} from '../evaluacion.service';
import {Notificaciones} from '../../global/notificacion';

@Component({
  selector: 'app-evaluacion-orden',
  templateUrl: './evaluacion-orden.component.html',
  styleUrls: ['./evaluacion-orden.component.css'],
  providers: [EvaluacionService,Notificaciones]
})
export class EvaluacionOrdenComponent implements OnInit {

  EvaluacionData: EvaluacionOrdenDataSource;
  Columnas: string[] = ['numero','monto','aporte','fecha','total']
	@Input() informacion_venta: Observable<any>;
	@Output() presupuesto_guardado = new EventEmitter();
	public numero: number;
	public cliente:any;
	public fecha = new Date();
	public primer_pago = new Date();
	public tipo:number;
	public tipo_nombre:string;
	public numero_cuotas:number;
	public capital:number;
	public cuota:number;
	public tasa:number;
	public total:number;
	public aporte:number;
	public Productos:Array<any>;
	public Cronograma:Array<any>;

  constructor(
  	private Servicio: EvaluacionService,
  	private Notificacion: Notificaciones
  ) { }

  ngOnInit() {

  	this.EvaluacionData = new EvaluacionOrdenDataSource();
  	this.Servicio.SeleccionarNumero().subscribe(res=>{
  		this.numero=res.numero
  	})

  	this.informacion_venta.subscribe(res=>{
  		if (res) {
	  		if (res.cliente) {
	  			this.cliente=res.cliente;
	  		}
	  		
	  		if (res.capital) {
	  			this.capital=res.capital;
	  		}

	  		if (res.aporte) {
	  			this.aporte=res.aporte;
	  		}

	  		if (res.interes) {
	  			this.tasa=res.interes/100;
	  		}

	  		if (res.total) {
	  			this.total=res.total;
	  		}

	  		if (res.venta) {
	  			this.tipo=res.venta;
	  			if (res.venta==2) {
	  				this.tipo_nombre="PRODUCTOS";
	  			}else{
	  				this.tipo_nombre="CRÉDITO";
	  			}
	  		}

	  		if (res.cuotas) {
	  			this.cuota=res.cuotas;
	  		}

	  		if (res.productos) {
	  			res.productos.forEach((item)=>{
	  				item.estado=item.numero*item.precio
	  			})
	  			this.Productos=res.productos;
	  		}

	  		if (res.cronograma) {
	  			this.primer_pago=res.cronograma[0].fecha
	  			this.Cronograma=res.cronograma;
	  			this.EvaluacionData.CargarInformacion(this.Cronograma);
	  		}
  		}

  	})
  }

  Guardar(){

  	this.Servicio.SeleccionarNumero().subscribe(res=>{
  		this.numero=res.numero
  	})

  	this.Servicio.CrearPresupuesto(
  		this.cliente.id,
			this.tipo,
			this.fecha,
			0,
			this.cuota,
			this.capital,
			this.tasa,
			this.total,
			"",
			"",
			"",
			"",
			""
  	).subscribe(res=>{

      if( res['codigo']==0 ) {
 		    if (this.Cronograma.length>0) {
          this.Cronograma.forEach((item)=>{
            this.Servicio.CrearPresupuestoCronograma(
              res['data'],
              item.capital,
              item.interes,
              item.aporte,
              item.fecha,
            ).subscribe()
          })
        }

  		  // if (this.Productos.length>0) {
	  	  // 	this.Productos.forEach((item)=>{
	  	  // 		this.Servicio.CrearPresupuestoCronograma(
	  	  // 			res['data'],
	  	  // 			item.id,
			  // 			item.numero,
			  // 			item.precio,
	  	  // 		).subscribe()
	  	  // 	})
  		  // }
        
  		  if (res['data']>0) {
  			  this.presupuesto_guardado.emit(true);
  			  this.Notificacion.Snack("Se creó el presupuesto número "+this.numero,"")
  		  }
      }
  	})

  }

}

export class EvaluacionOrdenDataSource {

  public Cuotas= new BehaviorSubject<any>([]);

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.Cuotas.asObservable();
  }
  
  disconnect() {
    this.Cuotas.complete();
  }
  
  CargarInformacion(cuotas){
    this.Cuotas.next(cuotas)
  }
}