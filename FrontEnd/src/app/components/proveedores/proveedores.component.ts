import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import {ProveedorService} from './proveedor.service';
import {ProveedorDataSource} from './proveedor.dataservice';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

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

  CargarData() {
    this.ListadoProveedor.CargarProveedores(
      this.FiltroRuc.nativeElement.value,
      this.FiltroNombre.nativeElement.value);
    
  }

}
