import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {merge, Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {ServiciosDirecciones, Departamento} from '../../global/direcciones';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component'
import { ServiciosGenerales } from '../../global/servicios';
import { MarcaDataSource } from './marca.data.service';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css'],
  providers: [ServiciosGenerales]
})
export class MarcaComponent implements OnInit {

  ListadoMarca: MarcaDataSource;
    Columnas: string[] = ['numero', 'tipo', 'marca', 'opciones'];
    @ViewChild('InputTipo') FiltroTipo: ElementRef;
    @ViewChild('InputNombre') FiltroMarca: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
      private Servicio: ServiciosGenerales,
    ) {}

  ngOnInit() {
      this.ListadoMarca = new MarcaDataSource(this.Servicio);
      this.ListadoMarca.CargarMarca('', '', 1, 10);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit () {

      this.paginator.page
        .pipe(
          tap(() => this.CargarData())
         ).subscribe();
       merge(
         fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
         fromEvent(this.FiltroMarca.nativeElement, 'keyup')
        )
       .pipe(
         debounceTime(200),
         distinctUntilChanged(),
         tap(() => {
           this.paginator.pageIndex = 0;
           this.CargarData();
         })
        ).subscribe();
     }

  CargarData() {
      this.ListadoMarca.CargarMarca(
      this.FiltroTipo.nativeElement.value,
      this.FiltroMarca.nativeElement.value, 1, 10);
    }
}
