import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzasService } from '../../cobranzas-listar/cobranzas.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import {Notificaciones} from 'src/app/core/servicios/notificacion';
import { MatDialog } from '@angular/material/dialog';
import { VentanaEditarCuotasComponent } from './ventana-editar-cuotas/ventana-editar-cuotas.component';

@Component({
  selector: 'app-cobranza-pnp',
  templateUrl: './cobranza-pnp.component.html',
  styleUrls: ['./cobranza-pnp.component.scss']
})
export class CobranzaPnpComponent implements OnInit {

  @Input() sede_seleccionada: BehaviorSubject<any>;
  @Output() cargando = new EventEmitter() ;

  public ListadoCobranzaPNP: CobranzaPNPDataSource;
  public Columnas: string[] = ['numero', 'cliente', 'monto', 'opciones'];

  public sede : number ;
  public fecha_inicio : Date ;
  public fecha_fin : Date ;
  public total_cantidad : number = 0 ;
  public total_monto : number = 0 ;
  public codigo_cooperativa : string ;
  public cobranza_repetida : boolean = false ;

  constructor(
    private Servicio: CobranzasService ,
    private router:Router ,
    private notificacion: Notificaciones ,
    private dialogo : MatDialog ,
  ) { }

  ngOnInit() {
    this.ListadoCobranzaPNP = new CobranzaPNPDataSource(this.Servicio);

    this.codigo_cooperativa = "14070000" ;

    this.sede_seleccionada.subscribe(res=>{
      if(res.institucion==4){
        this.sede = res.sede ;
        this.fecha_inicio = res.fecha_inicio ;
        this.fecha_fin = moment(res.fecha_fin.endOf('month')).toDate() ;
        this.CargarData() ;
      }
    })

    this.ListadoCobranzaPNP.CargandoInformacion.subscribe(res=>{
      this.cargando.emit(res) ;
    })
  }

  CargarData() {
    this.Servicio.VerificarPagoSede(this.sede, this.fecha_fin).subscribe(res=>{
      // console.log(res)
      if(res>0){
        this.cobranza_repetida = true ;
      } else {
        this.cobranza_repetida = false ;
        // Se consultan las deudas por cliente y las deudas totales
        this.ListadoCobranzaPNP.CargarPagosClientes( this.sede, this.fecha_inicio, this.fecha_fin ) ;
        this.ListadoCobranzaPNP.CargarPagos( this.sede, this.fecha_inicio, this.fecha_fin ) ;
      }
    })
  }

  CalcularTotales(){
    this.ListadoCobranzaPNP.totales = { cantidad : 0 , total : 0 }  ;
    this.ListadoCobranzaPNP.InformacionCobranzas.forEach((item)=>{
      // console.log(item) ;
      if( item.considerar ) {
        this.ListadoCobranzaPNP.totales.cantidad = this.ListadoCobranzaPNP.totales.cantidad +1 ;
        this.ListadoCobranzaPNP.totales.total = this.ListadoCobranzaPNP.totales.total + item.monto_pendiente ;
      }
    })
  }

  EditarCuotas( cliente :any ) {
    let Ventana = this.dialogo.open( VentanaEditarCuotasComponent, {
      data : { cliente : cliente.cliente, cuotas : this.ObtenerCuotasxCliente( cliente.id_cliente ) } ,
      width : '1200px' ,
      maxHeight : '80vh'
    } ) ;

    Ventana.afterClosed().subscribe(res=>{
      if( res ) {
        let nuevo_array : Array<any> = this.ObtenerCuotasSinCliente(cliente.id_cliente) ;
        nuevo_array = nuevo_array.concat(res) ;
        this.ListadoCobranzaPNP.InformacionCobranzas = nuevo_array ;
        this.CalcularCuotaTotalCliente(cliente.id_cliente) ;
      }
    })
  }

  // Esta función devuelve un array con las cuotas que le pertenecen a un cliente
  ObtenerCuotasxCliente(
    id_cliente : number 
  ) :Array<any> {
    return this.ListadoCobranzaPNP.InformacionCobranzas.filter(e => e.id_cliente == id_cliente ) ;
  }

  // Esta función devuelve un array con las cuotas que NO le pertenecen a un cliente
  ObtenerCuotasSinCliente(
    id_cliente : number 
  ) :Array<any> {
    return this.ListadoCobranzaPNP.InformacionCobranzas.filter(e => e.id_cliente != id_cliente ) ;
  }

  // Esta función recalcular el monto pendiente del array que se muestra teniendo el cuenta el array total de las cuotas
  CalcularCuotaTotalCliente(
    id_cliente : number
  ) :void {
    let total : number = 0 ;
    let cuotas_cliente : Array<any> = this.ObtenerCuotasxCliente(id_cliente) ;
    cuotas_cliente.map(elemento=>{
      if ( elemento.considerar ) {
        total = total + elemento.monto_pendiente
      }
      return elemento ;
    })

    // Se asigna nuevamente valores al InformacionCobranzas
    let array_clientes = this.ListadoCobranzaPNP.InformacionCobranzasClientes.value ;
    array_clientes.map(item=>{
      if( item.id_cliente == id_cliente ) {
        item.monto_pendiente = total ;
      }
      return item ;
    }) ;
    this.ListadoCobranzaPNP.InformacionCobranzasClientes.next(array_clientes) ;
    this.CalcularTotales() ;
  }

  Guardar(){

    let nombre_archivo : string = "H" + this.codigo_cooperativa + moment(this.fecha_fin).format("YYYYMM") ;
    this.ListadoCobranzaPNP.CargandoInformacion.next(true);

    this.Servicio.CrearArchivoPNP(this.codigo_cooperativa, nombre_archivo,this.ListadoCobranzaPNP.InformacionCobranzas).subscribe(res=>{
      // console.log(res);
      if(res['codigo']===0){
        this.Servicio.CrearCabecera(
          this.sede_seleccionada.value.sede,
          1,
          this.fecha_inicio,
          this.fecha_fin,
          this.ListadoCobranzaPNP.totales.cantidad,
          this.ListadoCobranzaPNP.totales.total,
          nombre_archivo,
          this.ListadoCobranzaPNP.InformacionCobranzas
        )
        .pipe(finalize(()=>this.ListadoCobranzaPNP.CargandoInformacion.next(true)))
        .subscribe(res=>{
          if(res['codigo']===0){
            this.notificacion.Snack("Se registró la cobranza satisfactoriamente.","") ;
          } else {
            this.notificacion.Snack("Ocurrió un error al registrar la cobranza.","") ;
          }
          this.router.navigate(['/cobranza-archivos']) ;
        })
      } else {
        this.ListadoCobranzaPNP.CargandoInformacion.next(true) ;
        this.notificacion.Snack("Ocurrió un error al crear el archivo, inténtelo nuevamente en un momento.","")
        this.router.navigate(['/cobranza-archivos']) ;
      }
    })
  }

}

  
export class CobranzaPNPDataSource implements DataSource<any> {

  public InformacionCobranzas : Array<any> = [];
  public InformacionCobranzasClientes = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public totales: any = {cantidad : 0, total: 0};
  public informacion : Array <any>;

  constructor(
    private Servicio: CobranzasService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCobranzasClientes.asObservable();
  }

  disconnect() {
    // this.InformacionCobranzas.complete();
    // this.CargandoInformacion.complete();
  }

  CargarPagosClientes(  
    sede : number ,
    fecha_inicio : Date,
    fecha_fin : Date,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarPNPClientes( sede, fecha_inicio, fecha_fin )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if(res['data']){
        this.totales = { cantidad : 0, total : 0 } ;
        this.InformacionCobranzasClientes.next(res['data'].cronograma) ;
        // console.log( res['data'].cronograma );
        // this.informacion = res['data'].cronograma ;
        // this.InformacionCobranzasClientes.value.map((item)=>{
        //   // console.log(item)
        //   // if( item.considerar ) {
        //     this.totales.cantidad = this.totales.cantidad + 1 ;
        //     this.totales.total = Math.round( (this.totales.total + item.monto_pendiente) * 100 ) / 100 ;
        //   // }
        //   return item ;
        // });
      } else {
        this.InformacionCobranzasClientes.next([]) ;
        this.totales = {cantidad : 0, total : 0}
      }
    });
  }

  CargarPagos(
    sede : number ,
    fecha_inicio : Date,
    fecha_fin : Date,
  ) {
    // this.CargandoInformacion.next(true);

    this.Servicio.ListarPNP( sede, fecha_inicio, fecha_fin )
    .pipe(
      catchError(() => of([])),
      // finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if(res['data']){
        // this.totales = { cantidad : 0, total : 0 } ;
        this.InformacionCobranzas = res['data'].cronograma ;
        // console.log( res['data'].cronograma );
        // this.informacion = res['data'].cronograma ;
        this.InformacionCobranzas.forEach((item)=>{
          if( item.considerar ) {
            this.totales.cantidad = this.totales.cantidad + 1 ;
            this.totales.total = Math.round( (this.totales.total + item.monto_pendiente) * 100 ) / 100 ;
          }
        });
      } else {
        this.InformacionCobranzas = [] ;
        // this.informacion = [] ;
        // this.totales = {cantidad : 0, total : 0}
      }
    });
  }
}