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
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClienteService]
})

export class ClientesComponent implements OnInit {

  ListadoCliente: ClienteDataSource;
  Columnas: string[] = ['numero', 'foto', 'subsede' , 'codigo' , 'nombrecliente', 'dni',  'opciones'];
  public maestro;


  @ViewChild('InputDNI') FiltroDni: ElementRef;
  @ViewChild('InputNombreCliente') FiltroNombre: ElementRef;
 // @ViewChild('InputApellido') FiltroApellido: ElementRef;
  @ViewChild('InputSede') FiltroSede: ElementRef;
  @ViewChild('InputSubsede') FiltroSubsede: ElementRef;
  @ViewChild('InputNombreInst') FiltroInst: ElementRef;

  constructor(
    private Servicio: ClienteService,
    public DialogoClientes: MatDialog,
    public DialogFileUpload: MatDialog,
    public DialogoContacto: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
   this.ListadoCliente = new ClienteDataSource(this.Servicio);
   this.ListadoCliente.CargarClientes('', '', '', '', '', 1, 10);
 }

 // tslint:disable-next-line:use-life-cycle-interface
 ngAfterViewInit() {
   fromEvent(this.FiltroDni.nativeElement, 'keyup')
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
    fromEvent(this.FiltroInst.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.CargarData();
      })
     ).subscribe();

     fromEvent(this.FiltroSede.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.CargarData();
      })
     ).subscribe();

     fromEvent(this.FiltroSubsede.nativeElement, 'keyup')
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
   this.FiltroInst.nativeElement.value,
   this.FiltroSede.nativeElement.value,
   this.FiltroSubsede.nativeElement.value,
   this.FiltroDni.nativeElement.value,
   this.FiltroNombre.nativeElement.value, 1, 10);
 }

 Agregar() {
   // tslint:disable-next-line:prefer-const
   let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
     width: '800px'
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
    data: {objeto: 'cliente', valor: cliente.nombre}
  });
  VentanaConfirmar.afterClosed().subscribe(res => {
    if (res === true) {
     // tslint:disable-next-line:no-shadowed-variable
     this.Servicio.Eliminar(cliente.id).subscribe(res => {
       this.CargarData();
       this.snackBar.open('Se eliminó el cliente satisfactoriamente.', '', {
        duration: 2500, verticalPosition: 'bottom'
      });
     });
    }
  });
 }


 Editar(id) {
  this.Servicio.Seleccionar(id).subscribe(res => {
    // tslint:disable-next-line:prefer-const
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
      width: '800px',
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
  console.log(cliente);
  let VentanaContacto = this.DialogoContacto.open(VentanaEmergenteContacto, {
    width: '1200px',
    data: cliente
  });
}

SubirImagen(id) {
  // tslint:disable-next-line:prefer-const
  let VentanaFileUpload = this.DialogFileUpload.open(FileUpload, {
    width: '800px',
    data : id
  });
}

}
