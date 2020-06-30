import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VentanaEmergenteGastos} from './ventana-emergente-gastos/ventanaemergente-gastos';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import {ListadoSalidaVendedoresService} from './listado-salida-vendedores.service';
import {ListadoSalidaVendedoresDataSource} from './listado-salida-vendedores.dataservice'
import {ServiciosGenerales} from '../global/servicios'
import {merge, Observable, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';

@Component({
  selector: 'app-listado-salida-vendedores',
  templateUrl: './listado-salida-vendedores.component.html',
  styleUrls: ['./listado-salida-vendedores.component.css'],
  providers:[ListadoSalidaVendedoresService,ServiciosGenerales]
})

export class ListadoSalidaVendedoresComponent implements OnInit {

  @ViewChild('InputPecosa', { static: true }) FiltroPecosa: ElementRef;
  @ViewChild('InputDestino', { static: true }) FiltroDestino: ElementRef;
  @ViewChild('InputSucursal', { static: true }) FiltroSucursal: MatSelect;
  @ViewChild('InputSerie') FiltroSerie: ElementRef;
  @ViewChild('InputVendedor', { static: true }) FiltroVendedor: ElementRef;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public fecha_inicio:Date;
  public fecha_fin:Date;

  ListadoSalida: ListadoSalidaVendedoresDataSource
 
  public Sucursales:Array<any>;
 
  displayedColumns: string[] = ['numero', 'pecosa', 'sucursal', 'fecha', 'destino', 'estado', 'opciones'];
 
  constructor(
    public Dialogo: MatDialog,
    private Servicio:ListadoSalidaVendedoresService,
    private General: ServiciosGenerales
  ) { }

  ngOnInit() {
    this.fecha_inicio = null ;
    this.fecha_fin = null ;

    this.General.ListarSucursal(0,"").subscribe(res=>this.Sucursales=res)

    this.ListadoSalida = new ListadoSalidaVendedoresDataSource(this.Servicio);
    this.ListadoSalida.CargarDatos("", null, this.fecha_inicio, this.fecha_fin, "","", 0,1, 10, "fecha desc");

}

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroPecosa.nativeElement,'keyup'),
      fromEvent(this.FiltroDestino.nativeElement,'keyup'),
      fromEvent(this.FiltroVendedor.nativeElement,'keyup'),
      this.sort.sortChange,
    ).pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
        this.paginator.pageIndex = 0;
        this.CargarData();
       })
    ).subscribe();

    this.paginator.page
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
       this.paginator.pageIndex = 0;
       this.CargarData();
      })
   ).subscribe();
  }

  CargarGastos(salida){
    let Ventana = this.Dialogo.open(VentanaEmergenteGastos,{
      width: '1200px',
      data: salida
    })
  }

  AnularSalida(salida){
    let Dialogo = this.Dialogo.open(VentanaConfirmarComponent,{
      data: {objeto: "la salida", valor: salida.pecosa}
    })
  
    Dialogo.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarSalida(salida.id).subscribe(respuesta=>{
          console.log(respuesta)
          this.CargarData()
        });
      }
    })
  }

  CargarData(){
    this.ListadoSalida.CargarDatos(
      this.FiltroPecosa.nativeElement.value,
      this.FiltroSucursal.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroDestino.nativeElement.value,
      this.FiltroVendedor.nativeElement.value,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction
    )
  }

}