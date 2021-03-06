import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {merge, Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {VentanaConfirmarComponent} from 'src/app/compartido/componentes/ventana-confirmar/ventana-confirmar.component'
import { ModeloDataSource } from './modelo.data.service';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { VentanaEmergenteModelo } from './ventana-emergente/ventanaemergente';

@Component({
  selector: 'app-modelo',
  templateUrl: './modelo.component.html',
  styleUrls: ['./modelo.component.css'],
  providers: [ServiciosGenerales]
})
export class ModeloComponent implements OnInit {

  ListadoModelo: ModeloDataSource;
    Columnas: string[] = ['numero', 'tipo', 'marca', 'modelo', 'opciones'];

    @ViewChild('InputTipo', { static: true }) FiltroTipo: ElementRef;
    @ViewChild('InputMarca', { static: true }) FiltroMarca: ElementRef;
    @ViewChild('InputNombre', { static: true }) FiltroModelo: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
      private Servicio: ServiciosGenerales,
      public DialogoModelo: MatDialog,
    ) {}

    ngOnInit() {
      this.ListadoModelo = new ModeloDataSource(this.Servicio);
      this.ListadoModelo.CargarModelo('','', '', 1, 10);
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit () {

      this.paginator.page
        .pipe(
          tap(() => this.CargarData())
         ).subscribe();
       merge(
         fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
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
        this.FiltroTipo.nativeElement.value,
        this.FiltroMarca.nativeElement.value,
        this.FiltroModelo.nativeElement.value,  this.paginator.pageIndex +1,
        this.paginator.pageSize
      );
    }

    Agregar() {

      let VentanaTipo = this.DialogoModelo.open(VentanaEmergenteModelo, {
        width: '350px'
      });
   
      VentanaTipo.afterClosed().subscribe(res => {
        this.CargarData();
      });
    }

    Editar(id) {
      this.Servicio.SeleccionarModelo(id).subscribe(res => {
   
        let VentanaTipo = this.DialogoModelo.open(VentanaEmergenteModelo, {
          width: '350px',
          data: res
        });
        // tslint:disable-next-line:no-shadowed-variable
        VentanaTipo.afterClosed().subscribe (res => {
          this.CargarData();
        });
      });
    }

    Eliminar(modelo) {
      let VentanaProvincia = this.DialogoModelo.open(VentanaConfirmarComponent,{
        width: '400px',
        data: {objeto: 'el modelo', valor: modelo.nombre}
      });
   
      VentanaProvincia.afterClosed().subscribe(res=>{
        if(res==true){
         this.Servicio.EliminarModelo(modelo.id).subscribe(res=>{
           this.CargarData();
         })
        }
      })
    }
}
