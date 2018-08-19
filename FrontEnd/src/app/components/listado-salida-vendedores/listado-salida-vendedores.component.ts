import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VentanaEmergenteGastos} from './ventana-emergente/ventanaemergente';
import { VentanaEmergenteDet } from './ventana-emergentedet/ventanaemergentedet';
import {MatSelect, MatPaginator, MatSort,MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
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

 @ViewChild('InputPecosa') FiltroPecosa: ElementRef;
 @ViewChild('InputDestino') FiltroDestino: ElementRef;
 @ViewChild('InputSucursal') FiltroSucursal: MatSelect;
 @ViewChild('InputSerie') FiltroSerie: ElementRef;
 @ViewChild('InputVendedor') FiltroVendedor: ElementRef;
 @ViewChild('InputEstado') FiltroEstado: MatSelect;
 @ViewChild('fechainicio') FechaInicioFiltro: ElementRef;
 @ViewChild('fechafin') FechaFinFiltro: ElementRef;
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;

 ListadoSalida: ListadoSalidaVendedoresDataSource
 
 private Sucursales:number;
 
 displayedColumns: string[] = ['numero', 'pecosa', 'sucursal', 'fecha', 'destino', 'estado', 'opciones'];
 
 constructor(
 public DialogoGasto: MatDialog,
 public Dialogodetalle: MatDialog,
 private Servicio:ListadoSalidaVendedoresService,
 private General: ServiciosGenerales
 ) { }

ngOnInit() {

  this.General.ListarSucursal(null,"").subscribe(res=>this.Sucursales=res)

  this.ListadoSalida = new ListadoSalidaVendedoresDataSource(this.Servicio);
  this.ListadoSalida.CargarDatos(null, null, null, null, "",null,"", null,1, 10, "pecosa");

}

ngAfterViewInit(){

  this.sort.sortChange.subscribe(res => {
    this.paginator.pageIndex = 0;
  });

  merge(
    this.paginator.page,
    this.sort.sortChange,
    fromEvent(this.FiltroPecosa.nativeElement,'keyup'),
    fromEvent(this.FiltroDestino.nativeElement,'keyup'),
    fromEvent(this.FiltroSerie.nativeElement,'keyup'),
    fromEvent(this.FiltroVendedor.nativeElement,'keyup')
  ).pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
      this.paginator.pageIndex = 0;
      this.CargarData();
     })
    ).subscribe();
}

CargarData(){

  this.ListadoSalida.CargarDatos(
    this.FiltroPecosa.nativeElement.value,
    this.FiltroSucursal.value,
    this.FechaInicioFiltro.nativeElement.value,
    this.FechaFinFiltro.nativeElement.value,
    this.FiltroDestino.nativeElement.value,
    this.FiltroSerie.nativeElement.value,
    this.FiltroVendedor.nativeElement.value,
    this.FiltroEstado.value,
    this.paginator.pageIndex+1,
    this.paginator.pageSize,
    this.sort.active +" " + this.sort.direction  )
}

CambioFiltro(){
//   this.paginator.pageIndex = 0;
   this.CargarData()
}

// Cargagasto() {
//   let VentanaGastos = this.DialogoGasto.open(VentanaEmergenteGastos, {
//     width: '800px'
//   });
// }

// Eliminasalida() {
//  const VentanaConfirmar = this.DialogoGasto.open(VentanaConfirmarComponent, {
//   width: '400px',
//   data: {objeto: 'pecosa', valor: ""}
// });

//   VentanaConfirmar.afterClosed().subscribe(res => {
//    if (res === true) {
//     // tslint:disable-next-line:no-shadowed-variable
//     this.Servicio.Eliminar().subscribe( res => {
//     //  this.CargarData();
//        this.snackBar.open('Se eliminó salida satisfactoriamente.', '', {
//         duration: 2500, verticalPosition: 'bottom'
//      });
//      });
//    }
//   });
// }
//  Detalle() {
//    const VentanaDetalle = this.Dialogodetalle.open(VentanaEmergenteDet, {
//      width: '1200px'
//    });
//  }

}