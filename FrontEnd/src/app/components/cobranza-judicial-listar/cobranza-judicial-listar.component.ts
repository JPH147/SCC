import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzaJudicialService } from '../cobranza-judicial/cobranza-judicial.service';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { Router } from '@angular/router';
import { ProcesoJudicialVinculadosService } from '../proceso-judicial-vinculados/proceso-judicial-vinculados.service';
import { VentanaCambioDistritoComponent } from './ventana-cambio-distrito/ventana-cambio-distrito.component';
import { Notificaciones } from '../global/notificacion';

@Component({
  selector: 'app-cobranza-judicial-listar',
  templateUrl: './cobranza-judicial-listar.component.html',
  styleUrls: ['./cobranza-judicial-listar.component.css'],
})

export class CobranzaJudicialListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public TipoDocumentos : Array<any> ;
  public Cuentas : Array<any> = [];
  public Distritos : Array<any> = [];

  public ListadoProcesos: CobranzaDataSource;
  public Columnas: string[] = ['id_tipo_documento', 'fecha_inicio', 'cliente_nombre', 'expediente', 'vendedor', 'total_documentos','fecha_ultimo_documento','fecha_ultimo_documento_diferencia', 'opciones'];

  @ViewChild('InputExpediente', { static: true }) FiltroExpediente: ElementRef;
  @ViewChild('InputDistrito', { static: true }) FiltroDistrito: ElementRef;
  // @ViewChild('InputJuzgado', { static: true }) FiltroJuzgado: ElementRef;
  @ViewChild('InputDNI', { static: true }) FiltroDNI: ElementRef;
  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: MatSelect;

  constructor(
    private router : Router ,
    private Dialogo : MatDialog ,
    private Notificaciones : Notificaciones ,
    private _judicial: CobranzaJudicialService,
    private _vinculados : ProcesoJudicialVinculadosService
  ) { }

  ngOnInit() {
    this.ListarTipoDocumentos();
    this.EncontrarFecha();
    this.ListarDistritos();
    this.fecha_inicio = new Date() ;
    this.fecha_fin = new Date() ;

    this.ListadoProcesos = new CobranzaDataSource(this._judicial);
  }

  ngAfterViewInit () {

    fromEvent(this.FiltroDistrito.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.ListarDistritos();
      })
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup'),
      fromEvent(this.FiltroExpediente.nativeElement, 'keyup'),
      fromEvent(this.FiltroDistrito.nativeElement, 'keyup'),
      // fromEvent(this.FiltroJuzgado.nativeElement, 'keyup'),
      fromEvent(this.FiltroDNI.nativeElement, 'keyup'),
      // this.sort.sortChange
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.CargarData();
       })
    ).subscribe();
  }

  EncontrarFecha(){
    this._judicial.ObtenerFechaAntigua().subscribe(res=>{
      this.fecha_inicio = res ;
      this.ListadoProcesos.CargarDistritos("","","","","",this.fecha_inicio,this.fecha_fin,-1,"fecha_inicio desc");
    })
  }

  CargarData() {
    this.ListadoProcesos.CargarDistritos(
      this.FiltroDistrito.nativeElement.value,
      "",
      // this.FiltroJuzgado.nativeElement.value,
      this.FiltroExpediente.nativeElement.value,
      this.FiltroDNI.nativeElement.value,
      this.FiltroCliente.nativeElement.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroEstado.value,
      "fecha_inicio desc"
    );
  }

  CambioFiltro(){
    this.CargarData()
  }

  CambiarSede( proceso ){
    let Dialogo = this.Dialogo.open(VentanaCambioDistritoComponent,{
      data: proceso ,
      width: '1200px'
    }) ;

    Dialogo.afterClosed().subscribe(res=>{
      if(res){
        this.Notificaciones.Snack("Se creó el traslado satisfactoriamente.","")
        this.CargarData();
      }
      if(res===false) {
        this.Notificaciones.Snack("Ocurrió un error al crear el traslado.","")
      }
    })
  }

  ListarDistritos(){
    this._vinculados.ListarDistritosJudicialesActivos(
      this.FiltroDistrito.nativeElement.value || ""
    ).subscribe(res=>{
      this.Distritos = res ;
    })
  }

  EliminarProceso(proceso){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el proceso", valor: proceso.expediente }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this._judicial.EliminarProcesoCabecera(proceso.id).subscribe((res)=>{
          this.CargarData();
        });
      }
    })
  }

  EjecutarCobranza(proceso){
    this.router.navigate(['/cobranza-judicial','generar','nuevo', proceso.id] )
  }

  AgregarDocumentos(proceso){
    this.router.navigate(['/cobranza-judicial', 'agregar', proceso.id] )
  }

  ListarTipoDocumentos(){
    this._vinculados.ListarDocumentosJudiciales("",1,20).subscribe(res=>{
      this.TipoDocumentos = res['data'].documentos ;
    })
  }

}

export class CobranzaDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  public InformacionDistritos = new BehaviorSubject<any[]>([]);
  public InformacionInstancias = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);
  public InformacionDistritosArray : Array<any> = [] ;
  public InformacionInstanciasArray : Array<any> = [] ;

  constructor(
    private _judicial: CobranzaJudicialService,
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarDistritos(
    distrito:string,
    juzgado:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    orden:string,
  ) {
    this._judicial.ListarDistritos( distrito , juzgado , expediente , dni , nombre , fecha_inicio , fecha_fin , estado )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.InformacionDistritos.next(res['data'].distritos)
      this.InformacionDistritosArray = res['data'].distritos;
      this.ObtenerInstancias(
        juzgado ,
        expediente ,
        dni ,
        nombre ,
        fecha_inicio ,
        fecha_fin ,
        estado ,
        orden ,
      );
    });
  }

  ObtenerInstancias(
    juzgado:string,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    orden:string,
  ) {
    this.InformacionDistritosArray.forEach((item)=>{
      item['informacion_instancias'] = [] ;
      item['cargando_instancias'] = true ;
      this._judicial.ListarInstancias(
        item.id_distrito ,
        juzgado ,
        expediente ,
        dni ,
        nombre ,
        fecha_inicio ,
        fecha_fin ,
        estado
      ).subscribe(res=>{
        item['informacion_instancias'] = res['data'].instancias ;
        item['cargando_instancias'] = false;
        this.ObtenerProcesos(
          item['informacion_instancias'],
          expediente,
          dni,
          nombre,
          fecha_inicio,
          fecha_fin,
          estado,
          orden,
        )
      })
    })
  }

  // CargarInstancias(
  //   distrito:number,
  //   juzgado:string,
  //   expediente:string,
  //   dni:string,
  //   nombre:string,
  //   fecha_inicio:Date,
  //   fecha_fin:Date,
  //   estado:number,
  //   orden:string,
  // ) {
  //   this._judicial.ListarInstancias( distrito , juzgado , expediente , dni , nombre , fecha_inicio , fecha_fin , estado )
  //   .pipe(
  //     catchError(() => of([])),
  //     finalize(() => this.CargandoInformacion.next(false))
  //   )
  //   .subscribe(res => {
  //     this.InformacionInstancias.next(res['data'].instancias)
  //     this.InformacionInstanciasArray = res['data'].instancias;
  //     this.ObtenerProcesos(
  //       expediente ,
  //       juzgado ,
  //       dni ,
  //       nombre ,
  //       fecha_inicio ,
  //       fecha_fin ,
  //       estado ,
  //       orden ,
  //     );
  //   });
  // }

  ObtenerProcesos(
    instancias:Array<any>,
    expediente:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    orden:string,
  ){
    instancias.forEach((item)=>{
      item['informacion_procesos'] = new ProcesosDataSource() ;
      item['informacion_procesos'].CargarInformacion([]);
      item['cargando_procesos'] = true ;
      this._judicial.ListarV2(
        item.id_instancia ,
        expediente ,
        dni ,
        nombre ,
        fecha_inicio ,
        fecha_fin ,
        estado ,
        orden
      ).subscribe(res=>{
        item['informacion_procesos'].CargarInformacion(res['data'].procesos);
        item['cargando_procesos'] = false;
      })
    })
  }
}

export class ProcesosDataSource implements DataSource<any> {

  private InformacionDirecciones = new BehaviorSubject<any>([]);

  constructor(
  ) {
  }

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.InformacionDirecciones.asObservable();
  }

  disconnect(){
    this.InformacionDirecciones.complete();
  }

  CargarInformacion( informacion ){
    this.InformacionDirecciones.next(informacion);
  }

}