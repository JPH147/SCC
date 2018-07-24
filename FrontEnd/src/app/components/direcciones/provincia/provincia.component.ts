import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ServiciosDirecciones, Provincia} from '../../global/direcciones';
import {merge, Observable, fromEvent} from 'rxjs';
import {ProvinciaDataSource} from './provincia.dataservice'
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css'],
  providers: [ServiciosDirecciones]
})
export class ProvinciaComponent implements OnInit {

  ListadoProvincias: ProvinciaDataSource;
  Columnas: string[] = ['numero', 'departamento', 'nombre', 'opciones'];
  public maestro;

  @ViewChild('InputDepartamento') FiltroDepartamento: ElementRef;
  @ViewChild('InputProvincia') FiltroProvincia: ElementRef;

  constructor(
    private Servicio: ServiciosDirecciones,
    public DialogoDepartamentos: MatDialog
  ) {}

  ngOnInit() {
   this.ListadoProvincias = new ProvinciaDataSource(this.Servicio);
   this.ListadoProvincias.CargarProvincias('','');
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
 }

 CargarData() {
   this.ListadoProvincias.CargarProvincias(
   	this.FiltroDepartamento.nativeElement.value,
   	this.FiltroProvincia.nativeElement.value
	);
 }


 // Agregar() {

 //   let VentanaDepartamento = this.DialogoDepartamentos.open(VentanaEmergenteDepartamento, {
 //     width: '400px'
 //   });

 //   VentanaDepartamento.afterClosed().subscribe(res => {
 //     this.CargarData();
 //   });
 // }

 // Eliminar(producto) {
 //   let VentanaDepartamento = this.DialogoDepartamentos.open(VentanaEliminarDepartamento,{
 //     width: '400px',
 //     data: producto
 //   });
 //   VentanaDepartamento.afterClosed().subscribe(res=>{
 //     this.CargarData();
 //   })
 // }

 // Editar(id) {
 //   this.Servicio.SeleccionarDepartamento(id).subscribe(res => {

 //     let VentanaDepartamento = this.DialogoDepartamentos.open(VentanaEmergenteDepartamento, {
 //       width: '480px',
 //       data: res
 //     });
 //     // tslint:disable-next-line:no-shadowed-variable
 //     VentanaDepartamento.afterClosed().subscribe (res => {
 //       this.CargarData();
 //     });
 //   });
 // }
}
