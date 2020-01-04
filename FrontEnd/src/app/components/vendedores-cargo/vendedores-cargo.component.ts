import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ServiciosVentas } from '../global/ventas';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, fromEvent, merge} from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { MatPaginator , MatDialog } from '@angular/material';
import {Notificaciones} from '../global/notificacion';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import { VentanaVendedoresCargoComponent } from './ventana-vendedores-cargo/ventana-vendedores-cargo.component';

@Component({
  selector: 'app-vendedores-cargo',
  templateUrl: './vendedores-cargo.component.html',
  styleUrls: ['./vendedores-cargo.component.css'],
  providers : [ ServiciosVentas , Notificaciones ]
})
export class VendedoresCargoComponent implements OnInit {

  public ListadoVendedores : VendedoresDataSource ;
  public Columnas : Array <string> = [ "numero" , "nombre" , "opciones" ];
  @ViewChild(MatPaginator, { static: true }) paginator : MatPaginator ;

  @ViewChild('InputNombre', { static: true }) FiltroNombre : ElementRef ;

  constructor(
    private Servicio : ServiciosVentas ,
    private Dialogo : MatDialog ,
    private notificacion : Notificaciones
  ) { }

  ngOnInit() {
    this.ListadoVendedores = new VendedoresDataSource(this.Servicio);
    this.ListadoVendedores.CargarInformacion("",1,10)
  }

  ngAfterViewInit(){

    this.paginator.page.subscribe(()=>{
      this.CargarData()
    })

    merge(
      fromEvent(this.FiltroNombre.nativeElement, 'keyup'),
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
    this.ListadoVendedores.CargarInformacion(
      this.FiltroNombre.nativeElement.value ,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    )
  }

  Eliminar(vendedor) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el cargo', valor: vendedor.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarVendedorCargo(vendedor.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

  Agregar(){
    let Ventana = this.Dialogo.open(VentanaVendedoresCargoComponent,{
      width: '900px'
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData();
        this.notificacion.Snack("Se creó el cargo satisfactoriamente","")
      }else{
        this.notificacion.Snack("Ocurrió un error al crear el cargo","")
      }
    })

  }

  Editar( vendedor ){
    let Ventana = this.Dialogo.open(VentanaVendedoresCargoComponent,{
      width: '900px',
      data : { vendedor : vendedor }
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData();
        this.notificacion.Snack("Se actualizó el cargo satisfactoriamente","")
      }else{
        this.notificacion.Snack("Ocurrió un error al actualizar el cargo","")
      }
    })
  }

}

export class VendedoresDataSource implements DataSource<any>{

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
    nombre : string ,
    pagina : number ,
    total_pagina : number
  ){
    this.Cargando.next(true);
    this.Servicio.ListarVendedorCargo(nombre , pagina , total_pagina)
    .pipe(
      finalize( ()=>{ this.Cargando.next(false) } )
    )
    .subscribe(res=>{
      this.Informacion.next( res['data']);
      this.TotalResultados.next(res['mensaje']);
    })
  }
}