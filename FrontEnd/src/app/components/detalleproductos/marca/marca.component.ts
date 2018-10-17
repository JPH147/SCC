import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {merge, Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {ServiciosDirecciones, Departamento} from '../../global/direcciones';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component'
import { ServiciosGenerales } from '../../global/servicios';
import { MarcaDataSource } from './marca.data.service';
import { VentanaEmergenteMarca } from './ventana-emergente/ventanaemergente';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css'],
  providers: [ServiciosGenerales]
})
export class MarcaComponent implements OnInit {

  ListadoMarca: MarcaDataSource;
    Columnas: string[] = ['numero', 'tipo', 'marca', 'opciones'];
    public TotalResultados:number=0;
    @ViewChild('InputTipo') FiltroTipo: ElementRef;
    @ViewChild('InputNombre') FiltroMarca: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
      private Servicio: ServiciosGenerales,
      public DialogoMarca: MatDialog
    ) {}

  ngOnInit() {
      this.ListadoMarca = new MarcaDataSource(this.Servicio);
      this.ListadoMarca.CargarMarca('', '', 1, 10);
      this.ListadoMarca.TotalResultados.subscribe(res=>this.TotalResultados=res);
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
    console.log(this.paginator);
      this.ListadoMarca.CargarMarca(
      this.FiltroTipo.nativeElement.value,
      this.FiltroMarca.nativeElement.value,  this.paginator.pageIndex+1,
      this.paginator.pageSize);
    }

    Agregar() {

      let VentanaTipo = this.DialogoMarca.open(VentanaEmergenteMarca, {
        width: '350px'
      });
   
      VentanaTipo.afterClosed().subscribe(res => {
        this.CargarData();
      });
    }

    Editar(id) {
      this.Servicio.SeleccionarMarca(id).subscribe(res => {
   
        let VentanaTipo = this.DialogoMarca.open(VentanaEmergenteMarca, {
          width: '350px',
          data: res
        });
        // tslint:disable-next-line:no-shadowed-variable
        VentanaTipo.afterClosed().subscribe (res => {
          this.CargarData();
        });
      });
    }

    Eliminar(marca) {
      let VentanaProvincia = this.DialogoMarca.open(VentanaConfirmarComponent,{
        width: '400px',
        data: {objeto: 'la marca', valor: marca.nombre}
      });
   
      VentanaProvincia.afterClosed().subscribe(res=>{
        if(res==true){
         this.Servicio.EliminarMarca(marca.id).subscribe(res=>{
           this.CargarData();
         })
        }
      })
    }
}
