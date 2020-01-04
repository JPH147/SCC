import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
import {merge, Observable, fromEvent} from 'rxjs';
import {DistritoDataSource} from './distrito.dataservice'
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component'
import {VentanaEmergenteDistrito} from './ventana-emergente/ventanaemergente'
// import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-distrito',
  templateUrl: './distrito.component.html',
  styleUrls: ['./distrito.component.css'],
  providers:[ServiciosDirecciones],
//  encapsulation: ViewEncapsulation.None
})
export class DistritoComponent implements OnInit {

  ListadoDistritos: DistritoDataSource;
  Columnas: string[] = ['numero', 'departamento', 'provincia','nombre', 'opciones'];
  public TotalResultados:number=0;

  @ViewChild('InputDepartamento', { static: true }) FiltroDepartamento: ElementRef;
  @ViewChild('InputProvincia', { static: true }) FiltroProvincia: ElementRef;
  @ViewChild('InputDistrito', { static: true }) FiltroDistrito: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: ServiciosDirecciones,
    public DialogoDistritos: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoDistritos = new DistritoDataSource(this.Servicio);
   this.ListadoDistritos.CargarDistritos('','','',0,10);
   this.ListadoDistritos.TotalResultados.subscribe(res=>this.TotalResultados=res)
 }

// tslint:disable-next-line:use-life-cycle-interface
ngAfterViewInit () {

  this.paginator.page
    .pipe(
      tap(()=>this.CargarData())
     ).subscribe();

   merge(
     fromEvent(this.FiltroDepartamento.nativeElement, 'keyup'),
     fromEvent(this.FiltroProvincia.nativeElement, 'keyup'),
     fromEvent(this.FiltroDistrito.nativeElement, 'keyup')
    )
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.paginator.pageIndex=0;
       this.CargarData();
     })
    ).subscribe();
 }

 CargarData() {
   this.ListadoDistritos.CargarDistritos(
   	this.FiltroDepartamento.nativeElement.value,
   	this.FiltroProvincia.nativeElement.value,
   	this.FiltroDistrito.nativeElement.value,
    this.paginator.pageIndex,
    this.paginator.pageSize,
	);
 }


 Agregar() {
   let VentanaDistrito= this.DialogoDistritos.open(VentanaEmergenteDistrito, {
     width: '350px'
   });

   VentanaDistrito.afterClosed().subscribe(res => {
     this.CargarData();
   });
 }

 Eliminar(distrito) {
   let VentanaProvincia = this.DialogoDistritos.open(VentanaConfirmarComponent,{
     width: '400px',
     data: {objeto: 'el distrito', valor: distrito.nombre}
   });

   VentanaProvincia.afterClosed().subscribe(res=>{
     if(res==true){
      this.Servicio.EliminarDistrito(distrito.id).subscribe(res=>{
        this.CargarData();
      })
     }
   })
 }

 Editar(id) {
   this.Servicio.SeleccionarDistrito(id).subscribe(res => {

     let VentanaDistrito = this.DialogoDistritos.open(VentanaEmergenteDistrito, {
       width: '350px',
       data: res
     });
     // tslint:disable-next-line:no-shadowed-variable
     VentanaDistrito.afterClosed().subscribe (res => {
       this.CargarData();
     });
   });
 }
}