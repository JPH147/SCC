import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
import {merge, Observable, fromEvent} from 'rxjs';
import {ProvinciaDataSource} from './provincia.dataservice'
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component';
import {VentanaEmergenteProvincia} from './ventana-emergente/ventanaemergente'

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css'],
  providers: [ServiciosDirecciones]
})
export class ProvinciaComponent implements OnInit {

  ListadoProvincias: ProvinciaDataSource;
  Columnas: string[] = ['numero', 'departamento', 'nombre', 'opciones'];
  public TotalResultados:number=0;

  @ViewChild('InputDepartamento', { static: true }) FiltroDepartamento: ElementRef;
  @ViewChild('InputProvincia', { static: true }) FiltroProvincia: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: ServiciosDirecciones,
    public DialogoProvincias: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoProvincias = new ProvinciaDataSource(this.Servicio);
   this.ListadoProvincias.CargarProvincias('','',0,10);
   this.ListadoProvincias.TotalResultados.subscribe(res=>this.TotalResultados=res)
 }

// tslint:disable-next-line:use-life-cycle-interface
ngAfterViewInit () {

   this.paginator.page
    .pipe(
      tap(()=>this.CargarData())
     ).subscribe();

   merge(
     fromEvent(this.FiltroDepartamento.nativeElement, 'keyup'),
     fromEvent(this.FiltroProvincia.nativeElement, 'keyup')
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
   this.ListadoProvincias.CargarProvincias(
   	this.FiltroDepartamento.nativeElement.value,
   	this.FiltroProvincia.nativeElement.value,
    this.paginator.pageIndex,
    this.paginator.pageSize,
	);
 }


 Agregar() {
   let VentanaProvincia= this.DialogoProvincias.open(VentanaEmergenteProvincia, {
     width: '350px'
   });
   VentanaProvincia.afterClosed().subscribe(res => {
     this.CargarData();
   });
 }

 Eliminar(provincia) {
   let VentanaProvincia = this.DialogoProvincias.open(VentanaConfirmarComponent,{
     width: '400px',
     data: {objeto: 'la provincia', valor: provincia.nombre}
   });

   VentanaProvincia.afterClosed().subscribe(res=>{
     if(res==true){
      this.Servicio.EliminarProvincia(provincia.id).subscribe(res=>{
        this.CargarData();
      })
     }
   })
 }

 Editar(id) {
   this.Servicio.SeleccionarProvincia(id).subscribe(res => {

     let VentanaProvincia = this.DialogoProvincias.open(VentanaEmergenteProvincia, {
       width: '350px',
       data: res
     });
     // tslint:disable-next-line:no-shadowed-variable
     VentanaProvincia.afterClosed().subscribe (res => {
       this.CargarData();
     });
   });
 }
}
