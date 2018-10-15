import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {merge, Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {ServiciosDirecciones, Departamento} from '../../global/direcciones';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component'
import { ModeloDataSource } from './modelo.data.service';
import { ServiciosGenerales } from '../../global/servicios';

@Component({
  selector: 'app-modelo',
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.css'],
  providers: [ServiciosGenerales]
})
export class ModeloComponent implements OnInit {

  ListadoModelo: ModeloDataSource;
    Columnas: string[] = ['numero', 'tipo', 'marca', 'modelo', 'opciones'];
    @ViewChild('InputMarca') FiltroMarca: ElementRef;
    @ViewChild('InputNombre') FiltroModelo: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
      private Servicio: ServiciosGenerales,
    ) {}

    ngOnInit() {
      this.ListadoModelo = new ModeloDataSource(this.Servicio);
      this.ListadoModelo.CargarModelo('', '', 1, 10);
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit () {

      this.paginator.page
        .pipe(
          tap(() => this.CargarData())
         ).subscribe();
       merge(
         fromEvent(this.FiltroMarca.nativeElement, 'keyup'),
         fromEvent(this.FiltroModelo.nativeElement, 'keyup')
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
      this.ListadoModelo.CargarModelo(
      this.FiltroMarca.nativeElement.value,
      this.FiltroModelo.nativeElement.value, 1, 10);
    }
}
