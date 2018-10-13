import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import {ProveedorService} from './proveedores.service';
import {ProveedorDataSource} from './proveedores.dataservice';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import {MatPaginator, MatSort, MatDialog} from '@angular/material';
import {ProveedoresMovimientosComponent} from './proveedores-movimientos/proveedores-movimientos.component'

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [ProveedorService]
})
export class ProveedoresComponent implements OnInit {

  ListadoProveedor: ProveedorDataSource;
  Columnas: string[] = ['numero', 'ruc', 'nombre','opciones'];
  public maestro;

  @ViewChild('InputRUC') FiltroRuc: ElementRef;
  @ViewChild('InputNombreProvedor') FiltroNombre: ElementRef;

  constructor(
    private Servicio: ProveedorService,
    private DialogoMovimiento: MatDialog,
  ) { }

  ngOnInit() {
    this.ListadoProveedor = new ProveedorDataSource(this.Servicio);
    this.ListadoProveedor.CargarProveedores('','');
  }


  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    fromEvent(this.FiltroRuc.nativeElement, 'keyup')
    .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

    fromEvent(this.FiltroNombre.nativeElement, 'keyup')
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();
  }

  VerDetalle(proveedor){
    let VentanaDialogo = this.DialogoMovimiento.open(ProveedoresMovimientosComponent,{
       width: '1200px',
       data: {id: proveedor.id, nombre: proveedor.nombre}
    })
  }

  CargarData() {
    this.ListadoProveedor.CargarProveedores(
      this.FiltroRuc.nativeElement.value,
      this.FiltroNombre.nativeElement.value);
  }

}
