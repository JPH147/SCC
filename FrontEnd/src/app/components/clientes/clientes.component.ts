import { VentanaEmergenteClientes } from './ventana-emergente/ventanaemergente';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ClienteService} from './clientes.service';
import {ClienteDataSource} from './clientes.dataservice';
import {fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, delay} from 'rxjs/operators';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import { FileUpload } from './file-upload/fileupload';
import { VentanaEmergenteContacto} from './ventana-emergentecontacto/ventanaemergentecontacto';
import { VentanaObservacionesComponent} from './ventana-observaciones/ventana-observaciones.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClienteService]
})

export class ClientesComponent implements OnInit {

  ListadoCliente: ClienteDataSource;
  Columnas: string[] = ['numero', 'foto', 'codigo' , 'dni', 'nombrecliente', 'subsede' ,  'opciones'];
  public maestro;

  @ViewChild('InputInstitucion') FiltroInstitucion: ElementRef;
  @ViewChild('InputSede') FiltroSede: ElementRef;
  @ViewChild('InputSubsede') FiltroSubsede: ElementRef;
  @ViewChild('InputCargo') FiltroCargo: ElementRef;
  @ViewChild('InputCodigo') FiltroCodigo: ElementRef;
  @ViewChild('InputDNI') FiltroDni: ElementRef;
  @ViewChild('InputNombre') FiltroNombre: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private Servicio: ClienteService,
    public DialogoClientes: MatDialog,
    public DialogFileUpload: MatDialog,
    public DialogoContacto: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
   this.ListadoCliente = new ClienteDataSource(this.Servicio);
   this.ListadoCliente.CargarClientes('', '', '', '', '', '','',1, 10);
 }

 // tslint:disable-next-line:use-life-cycle-interface
 ngAfterViewInit() {
   merge(
     fromEvent(this.FiltroDni.nativeElement, 'keyup'),
     fromEvent(this.FiltroNombre.nativeElement, 'keyup'),
     fromEvent(this.FiltroInstitucion.nativeElement, 'keyup'),
     fromEvent(this.FiltroSede.nativeElement, 'keyup'),
     fromEvent(this.FiltroSubsede.nativeElement, 'keyup'),
     fromEvent(this.FiltroCargo.nativeElement, 'keyup'),
     fromEvent(this.FiltroCodigo.nativeElement, 'keyup'),
   ).pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.paginator.pageIndex=0;
       this.CargarData();
     })
    ).subscribe();

    this.paginator.page
    .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.CargarData();
     })
    ).subscribe();

 }

 CargarData() {
   this.ListadoCliente.CargarClientes(
   this.FiltroInstitucion.nativeElement.value,
   this.FiltroSede.nativeElement.value,
   this.FiltroSubsede.nativeElement.value,
   this.FiltroCargo.nativeElement.value,
   this.FiltroCodigo.nativeElement.value,
   this.FiltroDni.nativeElement.value,
   this.FiltroNombre.nativeElement.value,
   this.paginator.pageIndex+1,
   this.paginator.pageSize
   );
 }

 Agregar() {
   // tslint:disable-next-line:prefer-const
   let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
     width: '1000px'
   });

   VentanaClientes.afterClosed().subscribe(res => {
    this.CargarData();
    /*this.snackBar.open('Se creó el cliente satisfactoriamente.', '', {
      duration: 2500
    });*/
  });
 }


 Eliminar(cliente) {
  // tslint:disable-next-line:prefer-const
  let VentanaConfirmar = this.DialogoClientes.open(VentanaConfirmarComponent, {
    width: '400px',
    data: {objeto: 'el cliente', valor: cliente.nombre}
  });
  VentanaConfirmar.afterClosed().subscribe(res => {
    if (res === true) {
     // tslint:disable-next-line:no-shadowed-variable
     this.Servicio.Eliminar(cliente.id).subscribe(res => {
       this.CargarData();
     });
    }
  });
 }

Editar(id) {
  this.Servicio.Seleccionar(id).subscribe(res => {
    // tslint:disable-next-line:prefer-const
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
      width: '1000px',
      data: {objeto: res, id: id},
    });
    // tslint:disable-next-line:no-shadowed-variable
    VentanaClientes.afterClosed().subscribe (res => {
      this.CargarData();
    });
  });
}

AgregarDatoContacto(cliente) {
  // tslint:disable-next-line:prefer-const
  // console.log(cliente);
  let VentanaContacto = this.DialogoContacto.open(VentanaEmergenteContacto, {
    width: '1200px',
    data: cliente
  });
}

AgregarObservaciones(id){

  let VentanaContacto = this.DialogoContacto.open(VentanaObservacionesComponent, {
    width: '900px',
    data: id
  });
}

SubirImagen(id) {
  // tslint:disable-next-line:prefer-const
  let VentanaFileUpload = this.DialogFileUpload.open(FileUpload, {
    width: '800px',
    data : id
  });

  VentanaFileUpload.afterClosed().subscribe(res=>{
    this.CargarData()
  })
}

}
