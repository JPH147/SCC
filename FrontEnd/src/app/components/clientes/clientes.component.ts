import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, fromEvent, forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, takeUntil} from 'rxjs/operators';
import { ClienteService } from './clientes.service';
import { ClienteDataSource } from './clientes.dataservice';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { Router } from '@angular/router';
import { ServiciosTelefonos } from '../global/telefonos';
import { ServiciosDirecciones } from '../global/direcciones';
import { Notificaciones } from '../global/notificacion';
import { VentanaFotoComponent } from './ventana-foto/ventana-foto.component';
import { VentanaVentasComponent } from './ventana-ventas/ventana-ventas.component'
import { ArchivosService } from '../global/archivos';
import { VentanaEmergenteContacto} from './ventana-emergentecontacto/ventanaemergentecontacto';
import { VentanaObservacionesComponent} from './ventana-observaciones/ventana-observaciones.component';
import { VentanaEmergenteIntegralEditarComponent } from './ventana-emergente-integral-editar/ventana-emergente-integral-editar.component';
import { VentanaEmergenteIntegralAgregarComponent } from './ventana-emergente-integral-agregar/ventana-emergente-integral-agregar.component';
import { VentanaCobranzaClienteVencidasComponent } from '../cobranza-cliente-listar/ventana-cobranza-cliente-vencidas/ventana-cobranza-cliente-vencidas.component'
import { saveAs } from 'file-saver';
import { FileUpload } from './file-upload/fileupload';
import { ServiciosGenerales } from '../global/servicios';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClienteService, ServiciosTelefonos, ServiciosDirecciones, Notificaciones]
})

export class ClientesComponent implements OnInit, AfterViewInit {

  public sbj = new Subject();
  public ListadoCliente: ClienteDataSource;
  public Columnas: string[] = [];
  public ColumnasGeneral: string[] = ['numero', 'foto', 'codigo' , 'dni', 'nombrecliente', 'cargo' ,  'opciones'];
  public ColumnasComercial: string[] = ['numero', 'foto', 'codigo' , 'dni', 'nombrecliente', 'cargo' , 'cuotas_vencidas',  'opciones'];
  public estado: number ;
  public ClienteForm : FormGroup ;

  public Instituciones : Array<any> ;
  public Sedes : Array<any> ;

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
    private _generales : ServiciosGenerales,
    private _builder : FormBuilder
  ) {}

  ngOnInit() {
    this.CrearFormulario() ;

    this.ListadoCliente = new ClienteDataSource(this.Servicio);
    this.ListadoCliente.CargarClientes(false,'','', '','',4,3,1, 10,1);
    this.estado=1;
    this.Columnas = this.ColumnasGeneral ;

    this.ListarInstitucion() ;
  }

  ngAfterViewInit() {
    this.sbj.next() ;
    
    merge(
      this.ClienteForm.get('dni').valueChanges ,
      this.ClienteForm.get('codigo').valueChanges ,
      this.ClienteForm.get('cip').valueChanges ,
      this.ClienteForm.get('nombre').valueChanges ,
      this.ClienteForm.get('institucion').valueChanges ,
      this.ClienteForm.get('sede').valueChanges
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.sbj),
      tap(() => {
        this.paginator.pageIndex=0 ;
        this.CargarData() ;
      })
     ).subscribe();

     this.ClienteForm.get('relacion').valueChanges
     .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        if( this.ClienteForm.get('relacion').value ) {
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

  CrearFormulario(){
    this.ClienteForm = this._builder.group({
      dni : [ "" ] ,
      codigo : [ "" ] ,
      cip : [ "" ] ,
      nombre : [ "" ] ,
      institucion : [ 0 ] ,
      sede : [ 0 ] ,
      relacion : [ false ] ,
    })
  }

  CargarData() {
    this.ListadoCliente.CargarClientes(
      this.ClienteForm.get('relacion').value ,
      this.ClienteForm.get('codigo').value ,
      this.ClienteForm.get('cip').value ,
      this.ClienteForm.get('dni').value ,
      this.ClienteForm.get('nombre').value ,
      this.ClienteForm.get('institucion').value ,
      this.ClienteForm.get('sede').value || 0 ,
      this.paginator.pageIndex+1 ,
      this.paginator.pageSize ,
      this.estado
    );
  }
  
  Agregar() {
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteIntegralAgregarComponent, {
      width: '1200px'
    });

    VentanaClientes.afterClosed().subscribe(res => {
     this.CargarData();
   });
  }

  Eliminar(cliente) {
    let VentanaConfirmar = this.DialogoClientes.open(VentanaConfirmarComponent, {
      width: '400px',
      maxHeight: '80vh',
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
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteIntegralEditarComponent, {
      width: '1200px',
      maxHeight: '80vh',
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
    this.ClienteForm.get('codigo').setValue("") ;
    this.ClienteForm.get('dni').setValue("") ;
    this.ClienteForm.get('nombre').setValue("") ;

    this.CargarData();
  }

  VerTodos(){
    this.estado=1;
    this.paginator.pageIndex=0;
    this.ClienteForm.get('codigo').setValue("") ;
    this.ClienteForm.get('dni').setValue("") ;
    this.ClienteForm.get('nombre').setValue("") ;
    
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
      this.ClienteForm.get('codigo').value ,
      this.ClienteForm.get('cip').value ,
      this.ClienteForm.get('dni').value ,
      this.ClienteForm.get('nombre').value ,
      this.ClienteForm.get('institucion').value ,
      this.ClienteForm.get('sede').value ,
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

  VerDetalle(cliente, por_verificar){
    console.log(cliente)
    let Ventana = this.DialogoClientes.open( VentanaCobranzaClienteVencidasComponent,{
      width: '900px' ,
      data: { cliente: cliente.id, por_verificar : por_verificar }
    } ) ;

    Ventana.afterClosed().subscribe(res=>{
      console.log(res)
    })
  }

  ListarInstitucion(){
    this._generales.ListarInstitucion().subscribe( res => {
      this.Instituciones = res ;
    });
  }

  ListarSede() {
    this._generales.ListarSede( this.ClienteForm.get('institucion').value , '' ).subscribe(res => {
      this.Sedes=  res ;
  })}

  InstitucionSeleccionada(event) {
    // console.log(event)
    if ( event.value == 0 ) {
      this.ClienteForm.get('sede').setValue(0) ;
      this.ClienteForm.get('sede').disable() ;
    } else {
      this.ListarSede() ;
      this.ClienteForm.get('sede').setValue(0) ;
      this.ClienteForm.get('sede').enable() ;
    }
    this.CargarData() ;
  }

/* Se muestran los modelos cuando se selecciona una marca */
  SedeSeleccionada() {
    this.CargarData() ;
  }

}
