import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
import {merge, Observable, fromEvent} from 'rxjs';
import {DistritoDataSource} from './distrito.dataservice'
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component'
import {VentanaEmergenteDistrito} from './ventana-emergente/ventanaemergente'

@Component({
  selector: 'app-distrito',
  templateUrl: './distrito.component.html',
  styleUrls: ['./distrito.component.css'],
  providers:[ServiciosDirecciones]
})
export class DistritoComponent implements OnInit {

  ListadoDistritos: DistritoDataSource;
  Columnas: string[] = ['numero', 'departamento', 'provincia','nombre', 'opciones'];
  public TotalResultados:number=0;

  @ViewChild('InputDepartamento') FiltroDepartamento: ElementRef;
  @ViewChild('InputProvincia') FiltroProvincia: ElementRef;
  @ViewChild('InputDistrito') FiltroDistrito: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
     width: '400px'
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
       width: '480px',
       data: res
     });
     // tslint:disable-next-line:no-shadowed-variable
     VentanaDistrito.afterClosed().subscribe (res => {
       this.CargarData();
     });
   });
 }
}