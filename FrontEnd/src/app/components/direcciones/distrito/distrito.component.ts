import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
import {merge, Observable, fromEvent} from 'rxjs';
import {DistritoDataSource} from './distrito.dataservice'
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component'

@Component({
  selector: 'app-distrito',
  templateUrl: './distrito.component.html',
  styleUrls: ['./distrito.component.css']
})
export class DistritoComponent implements OnInit {

  ListadoDistritos: DistritoDataSource;
  Columnas: string[] = ['numero', 'departamento', 'provincia','nombre', 'opciones'];
  public maestro;

  @ViewChild('InputDepartamento') FiltroDepartamento: ElementRef;
  @ViewChild('InputProvincia') FiltroProvincia: ElementRef;
  @ViewChild('InputDistrito') FiltroDistrito: ElementRef;

  constructor(
    private Servicio: ServiciosDirecciones,
    public DialogoDepartamentos: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoDistritos = new DistritoDataSource(this.Servicio);
   this.ListadoDistritos.CargarDistritos('','','');
 }

// tslint:disable-next-line:use-life-cycle-interface
ngAfterViewInit () {
   fromEvent(this.FiltroDepartamento.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

    fromEvent(this.FiltroProvincia.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

    fromEvent(this.FiltroDistrito.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();
 }

 CargarData() {
   this.ListadoDistritos.CargarDistritos(
   	this.FiltroDepartamento.nativeElement.value,
   	this.FiltroProvincia.nativeElement.value,
   	this.FiltroDistrito.nativeElement.value
	);
 }


 // Agregar() {

 //   let VentanaProvincia= this.DialogoDepartamentos.open(VentanaEmergenteDepartamento, {
 //     width: '400px'
 //   });

 //   VentanaProvincia.afterClosed().subscribe(res => {
 //     this.CargarData();
 //   });
 // }

 Eliminar(distrito) {
   let VentanaProvincia = this.DialogoDepartamentos.open(VentanaConfirmarComponent,{
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
}