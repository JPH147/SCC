import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, fromEvent, merge} from 'rxjs';
import {finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {VentanaConfirmarComponent} from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import {Notificaciones} from 'src/app/core/servicios/notificacion';
import {VentanaTalonarioComponent} from './ventana-talonario/ventana-talonario.component'
import { VentanaAdjuntoComponent } from './ventana-adjunto/ventana-adjunto.component';

@Component({
  selector: 'app-talonarios',
  templateUrl: './talonarios.component.html',
  styleUrls: ['./talonarios.component.css'],
  providers : [ ServiciosVentas , Notificaciones ]
})
export class TalonariosComponent implements OnInit {

  public ListadoTalonarios : TalonariosDataSource ;
  public Columnas : Array <string> = [ "numero" , "serie" , "numero_inicio" , "numero_fin" , "disponibles" , "utilizados" , "consignacion" , "anulados"  , "total" , "opciones" ];

  @ViewChild('InputSerie', { static: true }) FiltroSerie : ElementRef ;
  @ViewChild(MatPaginator, { static: true }) paginator : MatPaginator ;

  constructor(
    private Servicio : ServiciosVentas ,
    private Dialogo : MatDialog ,
    private notificacion : Notificaciones
  ) { }

  ngOnInit() {

    this.ListadoTalonarios = new TalonariosDataSource(this.Servicio);
    this.ListadoTalonarios.CargarInformacion("",0,1,10)

  }

  ngAfterViewInit(){

    this.paginator.page.subscribe(()=>{
      this.CargarData()
    })

    merge(
      fromEvent(this.FiltroSerie.nativeElement, 'keyup'),
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.CargarData();
        this.paginator.pageIndex=0;
      })
    ).subscribe()
  }

  CargarData(){
    this.ListadoTalonarios.CargarInformacion(
      this.FiltroSerie.nativeElement.value ,
      0,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    )
  }

  Editar(talonario) {
    let Ventana = this.Dialogo.open(VentanaTalonarioComponent,{
      width: '900px' ,
      data : talonario
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData();
        this.notificacion.Snack("Se creó el talonario satisfactoriamente","")
      }else{
        this.notificacion.Snack("Ocurrió un error al crear al talonario","")
      }
    })
  }

  Eliminar(talonario) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el talonario', valor: talonario.serie}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.ActualizarTalonarios(talonario.serie, -1).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

  Agregar(){
    let Ventana = this.Dialogo.open(VentanaTalonarioComponent,{
      width: '900px'
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData();
        this.notificacion.Snack("Se creó el talonario satisfactoriamente","")
      }else{
        this.notificacion.Snack("Ocurrió un error al crear al talonario","")
      }
    })
  }

  AdjuntarContrato() {
    let Ventana = this.Dialogo.open(VentanaAdjuntoComponent,{
      width: '900px'
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData();
        this.notificacion.Snack("Se adjuntó el archivo satisfactoriamente","")
      }
      if(res === false){
        this.notificacion.Snack("Ocurrió un error al adjuntar el archivo","")
      }
    })
  }

}

export class TalonariosDataSource implements DataSource<any>{

  public Informacion = new BehaviorSubject<any>([])
  public TotalResultados = new BehaviorSubject<any>([])
  public Cargando = new BehaviorSubject <boolean> (false)

  constructor(
    private Servicio: ServiciosVentas
  ){ }

  connect(collectionViewer: CollectionViewer){
    return this.Informacion.asObservable()
  }

  disconnect(){
    this.Informacion.complete()
  }

  CargarInformacion(
    serie : string ,
    numero : number ,
    pagina : number ,
    total_pagina : number
  ){
    this.Cargando.next(true);
    this.Servicio.ListarTalonarios(serie , numero , pagina , total_pagina)
    .pipe(
      finalize( ()=>{ this.Cargando.next(false) } )
    )
    .subscribe(res=>{
      this.Informacion.next(res['data'].talonarios);
      this.TotalResultados.next(res['mensaje']);
    })
  }
}