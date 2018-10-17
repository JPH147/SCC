import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {merge, Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {ServiciosDirecciones, Departamento} from '../../global/direcciones';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component'
import { TipoDataSource } from './tipo.dataservice';
import { ServiciosGenerales } from '../../global/servicios';
import { VentanaEmergenteTipo } from './ventana-emergente/ventanaemergente';

@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.css'],
  providers: [ServiciosGenerales]
})
export class TipoComponent implements OnInit {

    ListadoTipo: TipoDataSource;
    Columnas: string[] = ['numero', 'nombre', 'unidadmedida', 'opciones'];
    @ViewChild('InputTipo') FiltroTipo: ElementRef;
    @ViewChild('InputUM') FiltroUM: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private Servicio: ServiciosGenerales,
        public DialogoTipo: MatDialog
      ) {}

    ngOnInit() {
        this.ListadoTipo = new TipoDataSource(this.Servicio);
        this.ListadoTipo.CargarTipo('', '', 1, 10);
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit () {

        this.paginator.page
          .pipe(
            tap(() => this.CargarData())
           ).subscribe();
         merge(
           fromEvent(this.FiltroTipo.nativeElement, 'keyup'),
           fromEvent(this.FiltroUM.nativeElement, 'keyup')
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
        this.ListadoTipo.CargarTipo(
        this.FiltroTipo.nativeElement.value,
        this.FiltroUM.nativeElement.value, this.paginator.pageIndex +1,
        this.paginator.pageSize);
      }

      Agregar() {

        let VentanaTipo = this.DialogoTipo.open(VentanaEmergenteTipo, {
          width: '350px'
        });
     
        VentanaTipo.afterClosed().subscribe(res => {
          this.CargarData();
        });
      }

      Editar(id) {
        this.Servicio.SeleccionarTipo(id).subscribe(res => {
     
          let VentanaTipo = this.DialogoTipo.open(VentanaEmergenteTipo, {
            width: '350px',
            data: res
          });
          // tslint:disable-next-line:no-shadowed-variable
          VentanaTipo.afterClosed().subscribe (res => {
            this.CargarData();
          });
        });
      }

      Eliminar(tipo) {
        let VentanaProvincia = this.DialogoTipo.open(VentanaConfirmarComponent,{
          width: '400px',
          data: {objeto: 'el tipo', valor: tipo.nombre}
        });
     
        VentanaProvincia.afterClosed().subscribe(res=>{
          if(res==true){
           this.Servicio.EliminarTipo(tipo.id).subscribe(res=>{
             this.CargarData();
           })
          }
        })
      }
}
