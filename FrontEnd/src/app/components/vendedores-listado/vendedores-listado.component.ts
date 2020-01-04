import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ServiciosVentas } from '../global/ventas';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, fromEvent, merge} from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { MatPaginator , MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import {VentanaVendedorComponent} from './ventana-vendedor/ventana-vendedor';
import {Notificaciones} from '../global/notificacion';
import { FileUploadVendedores } from './file-upload/fileupload';
import { VentanaFotoComponent } from '../clientes/ventana-foto/ventana-foto.component';

@Component({
  selector: 'app-vendedores-listado',
  templateUrl: './vendedores-listado.component.html',
  styleUrls: ['./vendedores-listado.component.css'],
  providers : [ ServiciosVentas , Notificaciones ]
})
export class VendedoresListadoComponent implements OnInit {

  public ListadoVendedores : VendedoresDataSource ;
  public Columnas : Array <string> = [ "numero" , "foto" , "cargo" , "dni" , "nombre" , "comision" , "opciones" ];

  @ViewChild('InputDocumento') FiltroDocumento : ElementRef ;
  @ViewChild('InputNombre') FiltroNombre : ElementRef ;
  @ViewChild('InputCargo') FiltroCargo : ElementRef ;
  @ViewChild (MatPaginator) paginator : MatPaginator ;

  constructor(
    private Servicio : ServiciosVentas ,
    private Dialogo : MatDialog ,
    private notificacion : Notificaciones
  ) { }

  ngOnInit() {

    this.ListadoVendedores = new VendedoresDataSource(this.Servicio);
    this.ListadoVendedores.CargarInformacion("","","",1,10)

  }

  ngAfterViewInit(){

    this.paginator.page.subscribe(()=>{
      this.CargarData()
    })

    merge(
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup'),
      fromEvent(this.FiltroNombre.nativeElement, 'keyup'),
      fromEvent(this.FiltroCargo.nativeElement, 'keyup'),
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
      this.FiltroDocumento.nativeElement.value ,
      this.FiltroNombre.nativeElement.value ,
      this.FiltroCargo.nativeElement.value ,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    )
  }

  Eliminar(vendedor) {

    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el vendedor', valor: vendedor.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarVendedor(vendedor.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

  Agregar(){
    let Ventana = this.Dialogo.open(VentanaVendedorComponent,{
      width: '900px'
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData();
        this.notificacion.Snack("Se creó el vendedor satisfactoriamente","")
      }else{
        this.notificacion.Snack("Ocurrió un error al crear al vendedor","")
      }
    })

  }

  Editar( vendedor ){
    let Ventana = this.Dialogo.open(VentanaVendedorComponent,{
      width: '900px',
      data : { vendedor : vendedor }
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData();
        this.notificacion.Snack("Se actualizó el vendedor satisfactoriamente","")
      }else{
        this.notificacion.Snack("Ocurrió un error al actualizar al vendedor","")
      }
    })
  }

  VerFoto(nombre,imagen){
    let VentanaFoto = this.Dialogo.open(VentanaFotoComponent, {
      width: '600px',
      data: {nombre: nombre, imagen: imagen}
    });
  }

  SubirImagen(vendedor) {
    // tslint:disable-next-line:prefer-const
    let VentanaFileUpload = this.Dialogo.open(FileUploadVendedores, {
      width: '800px',
      data : vendedor
    });

    VentanaFileUpload.afterClosed().subscribe(res=>{
      this.CargarData()
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
    documento : string ,
    nombre : string ,
    cargo : string ,
    pagina : number ,
    total_pagina : number
  ){
    this.Cargando.next(true);
    this.Servicio.ListarVendedores(documento , nombre , cargo , 0 , pagina , total_pagina)
    .pipe(
      finalize( ()=>{ this.Cargando.next(false) } )
    )
    .subscribe(res=>{
      this.Informacion.next( res['data'].vendedores);
      this.TotalResultados.next(res['mensaje']);
    })
  }
}