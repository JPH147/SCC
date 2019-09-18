import { Component, OnInit, Input } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzasService } from '../../cobranzas-listar/cobranzas.service';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import {Notificaciones} from '../../global/notificacion';

@Component({
  selector: 'app-cobranza-pnp',
  templateUrl: './cobranza-pnp.component.html',
  styleUrls: ['./cobranza-pnp.component.scss']
})
export class CobranzaPnpComponent implements OnInit {

  @Input() sede_seleccionada: BehaviorSubject<any>;

  public ListadoCobranzaPNP: CobranzaPNPDataSource;
  public Columnas: string[] = ['numero', 'tipo', 'codigo', 'fecha', 'cliente', 'monto', 'opciones'];

  public sede : number ;
  public fecha_inicio : Date ;
  public fecha_fin : Date ;
  public total_cantidad : number = 0 ;
  public total_monto : number = 0 ;
  public codigo_cooperativa : string ;
  public cobranza_repetida : boolean = false ;

  constructor(
    private Servicio: CobranzasService,
    private router:Router,
    private notificacion: Notificaciones
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
  }

  CargarData() {
    this.Servicio.VerificarPagoSede(this.sede, this.fecha_fin).subscribe(res=>{
      console.log(res)
      if(res>0){
        this.cobranza_repetida = true ;
      } else {
        this.cobranza_repetida = false ;
        this.ListadoCobranzaPNP.CargarPagos( this.sede, this.fecha_inicio, this.fecha_fin );
      }
    })
  }

  CalcularTotales(){
    this.ListadoCobranzaPNP.totales = { cantidad : 0 , total : 0 }  ;
    this.ListadoCobranzaPNP.InformacionCobranzas.value.forEach((item)=>{
      if( item.considerar ) {
        this.ListadoCobranzaPNP.totales.cantidad = this.ListadoCobranzaPNP.totales.cantidad +1 ;
        this.ListadoCobranzaPNP.totales.total = this.ListadoCobranzaPNP.totales.total + item.monto_pendiente ;
      }
    })
  }

  Guardar(){

    let nombre_archivo : string = "H" + this.codigo_cooperativa + moment(this.fecha_fin).format("YYYYMM") ;
    this.ListadoCobranzaPNP.CargandoInformacion.next(true);

    this.Servicio.CrearArchivoPNP(this.codigo_cooperativa, nombre_archivo,this.ListadoCobranzaPNP.InformacionCobranzas.value).subscribe(res=>{
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
          this.ListadoCobranzaPNP.InformacionCobranzas.value
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

  public InformacionCobranzas = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public totales: any = {cantidad : 0, total: 0};
  public informacion : Array <any>;

  constructor(
    private Servicio: CobranzasService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCobranzas.asObservable();
  }

  disconnect() {
    // this.InformacionCobranzas.complete();
    // this.CargandoInformacion.complete();
  }

  CargarPagos(
    sede : number ,
    fecha_inicio : Date,
    fecha_fin : Date,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarPNP( sede, fecha_inicio, fecha_fin )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if(res['data']){
        this.totales = { cantidad : 0, total : 0 } ;
        this.InformacionCobranzas.next(res['data'].cronograma) ;
        console.log( res['data'].cronograma );
        // this.informacion = res['data'].cronograma ;
        this.InformacionCobranzas.value.forEach((item)=>{
          if( item.considerar ) {
            this.totales.cantidad = this.totales.cantidad + 1 ;
            this.totales.total = Math.round( (this.totales.total + item.monto_pendiente) * 100 ) / 100 ;
          }
        });
      } else {
        this.InformacionCobranzas.next([]) ;
        // this.informacion = [] ;
        this.totales = {cantidad : 0, total : 0}
      }
    });
  }
  
}