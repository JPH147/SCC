import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import {merge, Observable, of , fromEvent, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ClienteService} from './clientes.service';
import {ClienteDataSource} from './clientes.dataservice';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';
import { FileUpload } from './file-upload/fileupload';
import { Router } from '@angular/router';
import { VentanaEmergenteContacto} from './ventana-emergentecontacto/ventanaemergentecontacto';
import { VentanaObservacionesComponent} from './ventana-observaciones/ventana-observaciones.component';
import { VentanaEmergenteClientes } from './ventana-emergente/ventanaemergente';
import {ServiciosTelefonos} from '../global/telefonos';
import {ServiciosDirecciones} from '../global/direcciones';
import { Notificaciones } from '../global/notificacion';
import {VentanaFotoComponent} from './ventana-foto/ventana-foto.component';
import { VentanaVentasComponent } from './ventana-ventas/ventana-ventas.component'
import { ArchivosService } from '../global/archivos';
import {saveAs} from 'file-saver';
import { VentanaCobranzaClienteVencidasComponent } from '../cobranza-cliente-listar/ventana-cobranza-cliente-vencidas/ventana-cobranza-cliente-vencidas.component'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClienteService, ServiciosTelefonos, ServiciosDirecciones, Notificaciones]
})

export class ClientesComponent implements OnInit {

  ListadoCliente: ClienteDataSource;
  public Columnas: string[] = [];
  public ColumnasGeneral: string[] = ['numero', 'foto', 'codigo' , 'dni', 'nombrecliente', 'cargo' ,  'opciones'];
  public ColumnasComercial: string[] = ['numero', 'foto', 'codigo' , 'dni', 'nombrecliente', 'cargo' , 'cuotas_vencidas',  'opciones'];
  public relacion : boolean = false ;
  public maestro;
  public estado: number ;
  
  @ViewChild('InputCodigo', { static: true }) FiltroCodigo: ElementRef;
  @ViewChild('InputCIP', { static: true }) FiltroCIP: ElementRef;
  @ViewChild('InputDNI', { static: true }) FiltroDni: ElementRef;
  @ViewChild('InputNombre', { static: true }) FiltroNombre: ElementRef;
  @ViewChild('InputCargo', { static: true }) FiltroCargo: ElementRef;
  @ViewChild('InputSubsede', { static: true }) FiltroSubsede: ElementRef;
  @ViewChild('InputRelacion', { static: false }) FiltroRelacion : MatCheckbox ;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: ClienteService,
    private DialogoClientes: MatDialog,
    private DialogFileUpload: MatDialog,
    private DialogoContacto: MatDialog,
    private snackBar: MatSnackBar,
    private STelefonos: ServiciosTelefonos,
    private SDirecciones: ServiciosDirecciones,
    private Notificacion: Notificaciones,
    private router: Router,
    private AServicio : ArchivosService,    
  ) {}

  ngOnInit() {
    this.ListadoCliente = new ClienteDataSource(this.Servicio);
    this.ListadoCliente.CargarClientes(false,'','', '','','','',1, 10,1);
    this.estado=1;
    this.Columnas = this.ColumnasGeneral ;
  }

  ngAfterViewInit() {
    merge(
      fromEvent(this.FiltroDni.nativeElement, 'keyup'),
      fromEvent(this.FiltroNombre.nativeElement, 'keyup'),
      fromEvent(this.FiltroCodigo.nativeElement, 'keyup'),
      fromEvent(this.FiltroCIP.nativeElement, 'keyup'),
      fromEvent(this.FiltroCargo.nativeElement, 'keyup'),
      fromEvent(this.FiltroSubsede.nativeElement, 'keyup')
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap((e : KeyboardEvent) => {
        // if(e.keyCode==13){
          this.paginator.pageIndex=0;
          this.CargarData();
        // }
      })
     ).subscribe();

     this.FiltroRelacion.change
     .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        if( this.FiltroRelacion.checked ) {
          this.Columnas = this.ColumnasComercial ;
        } else {
          this.Columnas = this.ColumnasGeneral ;
        }
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
      this.FiltroRelacion.checked,
      this.FiltroCodigo.nativeElement.value,
      this.FiltroCIP.nativeElement.value,
      this.FiltroDni.nativeElement.value,
      this.FiltroNombre.nativeElement.value,
      this.FiltroCargo.nativeElement.value,
      this.FiltroSubsede.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.estado
    );
  }
  
  Agregar() {
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
      width: '1200px'
    });

    VentanaClientes.afterClosed().subscribe(res => {
     this.CargarData();
   });
  }

  Eliminar(cliente) {
    let VentanaConfirmar = this.DialogoClientes.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el cliente', valor: cliente.nombre}
    });
    
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.Eliminar(cliente.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

  Editar(id, confirmar) {
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteClientes, {
      width: '1200px',
      data: {id: id, confirmar: confirmar},
    });
    VentanaClientes.afterClosed().subscribe (res => {
      this.CargarData();
    });
  }

  VerFoto(nombre,imagen){
    let VentanaFoto = this.DialogoContacto.open(VentanaFotoComponent, {
      width: '600px',
      data: {nombre: nombre, imagen: imagen}
    });
  }

  AgregarDatoContacto(cliente) {
    let VentanaContacto = this.DialogoContacto.open(VentanaEmergenteContacto, {
      width: '1200px',
      data: cliente
    });
  }

  AgregarObservaciones(id){
    let VentanaContacto = this.DialogoContacto.open(VentanaObservacionesComponent, {
      width: '1200px',
      data: id
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      if ( res ) {
        this.Notificacion.Snack("Se creó la observación satisfactoriamente.","")
      }
      if ( res===false ) {
        this.Notificacion.Snack("Ocurrió un error al crear la observación.","")
      }
    })
  }

  VerVentas(cliente){
    let VentanaContacto = this.DialogoContacto.open(VentanaVentasComponent, {
      width: '900px',
      data: {id: cliente.id, nombre: cliente.nombre}
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

  HacerVenta(id){
    forkJoin(
      this.STelefonos.ListarTelefono(id,"1",1,50),
      this.SDirecciones.ListarDireccion(id,"1",1,50)
    )
    .subscribe(res=>{
      if (res[0].mensaje==0 || res[1].mensaje==0) {
        this.snackBar.open("Debe agregar los datos de contacto para el cliente", "Entendido", {
          duration: 5000,
        });
      }else{
        this.router.navigate(['/ventas/nueva', id])
      }
    })
  }

  VerPendientes(){
    this.estado=5;
    this.paginator.pageIndex=0;
    this.FiltroCodigo.nativeElement.value = "" ;
    this.FiltroDni.nativeElement.value = "" ;
    this.FiltroNombre.nativeElement.value = "" ;

    this.CargarData();
  }

  VerTodos(){
    this.estado=1;
    this.paginator.pageIndex=0;
    this.FiltroCodigo.nativeElement.value = "" ;
    this.FiltroDni.nativeElement.value = "" ;
    this.FiltroNombre.nativeElement.value = "" ;
    
    this.CargarData();
  }

  DescartarTodos(){
    let VentanaConfirmar = this.DialogoClientes.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el grupo de clientes', valor:""}
    });
    
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarPendientes()
        .subscribe(res=>{
          if(res){
            this.CargarData();
          }
        })
      }
    });
  }

  ExportToExcel(){
    let nombre_archivo : string = "reporte_clientes_" + new Date().getTime();

    this.Servicio.ListarClientesUnlimited(
      nombre_archivo,
      this.FiltroCodigo.nativeElement.value,
      this.FiltroCIP.nativeElement.value,
      this.FiltroDni.nativeElement.value,
      this.FiltroNombre.nativeElement.value,
      this.FiltroCargo.nativeElement.value,
      this.FiltroSubsede.nativeElement.value,
      this.estado
    ).subscribe(res=>{
      if(res){
        this.AbrirArchivo(nombre_archivo,res);
      }
    })
  }

  AbrirArchivo(nombre_archivo,path){
    this.AServicio.ObtenerArchivo(path).subscribe(res=>{
      saveAs(res, nombre_archivo+'.xlsx');
    })
  }

  VerDetalle(cliente){
    console.log(cliente)
    let Ventana = this.DialogoClientes.open( VentanaCobranzaClienteVencidasComponent,{
      width: '900px' ,
      data: { cliente: cliente.id }
    } )
  }

}
