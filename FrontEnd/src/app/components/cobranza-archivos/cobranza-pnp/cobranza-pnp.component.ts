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

  public ListadoCobranzaPNP: CobranzaPNPDataSource;
  public Columnas: string[] = ['numero', 'codofin', 'cliente', 'monto', 'opciones'];

  public fecha_inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  public fecha_fin = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  @Input() sede_elegida:number;

  constructor(
    private Servicio: CobranzasService,
    private router:Router,
    private notificacion: Notificaciones
  ) { }

  ngOnInit() {
    console.log(this.sede_elegida);
    this.ListadoCobranzaPNP = new CobranzaPNPDataSource(this.Servicio);
    this.ListadoCobranzaPNP.CargarPagos( this.fecha_inicio, this.fecha_fin );
  }

  CargarData() {
    this.ListadoCobranzaPNP.CargarPagos( this.fecha_inicio, this.fecha_fin );
  }

  Guardar(){

    let nombre_archivo : string = "PNP" + moment(this.fecha_inicio).format("YYYYMMDD") + moment(this.fecha_fin).format("YYYYMMDD");
    let array_archivo : Array<any> = [];

    let longitud = this.ListadoCobranzaPNP.informacion.length;
    let i : number = 0;

    this.ListadoCobranzaPNP.informacion.forEach((item=>{
      array_archivo.push(item.archivo);
      i++;
      if(i==longitud){
        this.Servicio.Generar_PNP(
          nombre_archivo,
          array_archivo
        ).subscribe(res=>{
          console.log(res);

          if(res['codigo']==0){

            this.Servicio.CrearCabecera(
              this.sede_elegida,
              1,
              this.fecha_inicio,
              this.fecha_fin,
              this.ListadoCobranzaPNP.totales.cantidad,
              this.ListadoCobranzaPNP.totales.total,
              nombre_archivo
            ).subscribe(res=>{

              if(res['codigo']==0){

                this.ListadoCobranzaPNP.informacion.forEach((item)=>{
                  this.Servicio.CrearDetalle(
                    res['data'],
                    item.id_cliente,
                    item.codofin,
                    item.monto_pendiente
                  ).subscribe(res=>{
                    this.notificacion.Snack("Se creó el archivo con éxito","")
                  })
                })
              } else {
                this.notificacion.Snack("Ocurrió un error al generar el archivo","")
              }
        
              setTimeout(()=>(
                this.router.navigate(['/cobranza-archivos'])
              ),200)

            })
          }

        })
      }
    }))

  }


}

  
export class CobranzaPNPDataSource implements DataSource<any> {

  private InformacionCobranzas = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public totales: any = {cantidad : 0, total: 0};
  public informacion : Array <any>;

  constructor(
    private Servicio: CobranzasService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCobranzas.asObservable();
  }

  disconnect() {
    this.InformacionCobranzas.complete();
    this.CargandoInformacion.complete();
  }

  CargarPagos(
    fecha_inicio : Date,
    fecha_fin : Date,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarPNP( fecha_inicio, fecha_fin )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.InformacionCobranzas.next(res['data'].cronograma);
      this.informacion = res['data'].cronograma;
      this.totales = {cantidad : res['mensaje'].cantidad, total : res['mensaje'].total}
      console.log(res)
    });

  }
}