import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ClienteService } from './clientes.service';
import { ClienteDataSource } from './clientes.dataservice';
import { VentanaConfirmarComponent } from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiciosTelefonos } from 'src/app/core/servicios/telefonos';
import { ServiciosDirecciones } from 'src/app/core/servicios/direcciones';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { VentanaFotoComponent } from '../../compartido/componentes/ventana-foto/ventana-foto.component';
import { VentanaVentasComponent } from '../../compartido/componentes/ventana-ventas/ventana-ventas.component'
import { ArchivosService } from '../../core/servicios/archivos';
import { VentanaEmergenteContacto} from '../../compartido/componentes/ventana-emergentecontacto/ventanaemergentecontacto';
import { VentanaRelacionadosComponent} from './ventana-relacionados/ventana-relacionados.component';
import { VentanaEmergenteIntegralEditarComponent } from '../ventana-emergente-integral-editar/ventana-emergente-integral-editar.component';
import { VentanaEmergenteIntegralAgregarComponent } from '../ventana-emergente-integral-agregar/ventana-emergente-integral-agregar.component';
import { VentanaCobranzaClienteVencidasComponent } from '../../components/cobranza-cliente-listar/ventana-cobranza-cliente-vencidas/ventana-cobranza-cliente-vencidas.component'
import { saveAs } from 'file-saver';
import { FileUpload } from '../file-upload/fileupload';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [ClienteService, ServiciosTelefonos, ServiciosDirecciones, Notificaciones]
})

export class ClientesComponent implements OnInit, AfterViewInit {

  public ListadoCliente: ClienteDataSource;
  public Columnas: string[] = [];
  public ColumnasGeneral: string[] = ['numero', 'foto', 'codigo' , 'dni', 'nombrecliente', 'cargo' ,  'opciones'];
  public ColumnasComercial: string[] = ['numero', 'foto', 'codigo' , 'dni', 'nombrecliente', 'cargo' , 'cuotas_vencidas',  'opciones'];
  public estado: number ;
  public ClienteForm : FormGroup ;

  public Instituciones : Array<any> ;
  public Sedes : Array<any> ;
  public permiso : Rol ;

  public nueva_consulta : boolean = false ; // Esto se hace para saber cuándo se hace la primera búsqueda

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Servicio: ClienteService,
    private Dialogo: MatDialog,
    private DialogoClientes: MatDialog,
    private DialogFileUpload: MatDialog,
    private DialogoContacto: MatDialog,
    private snackBar: MatSnackBar,
    private STelefonos: ServiciosTelefonos,
    private SDirecciones: ServiciosDirecciones,
    private Notificacion: Notificaciones,
    private router : Router ,
    private route : ActivatedRoute ,
    private AServicio : ArchivosService,
    private _generales : ServiciosGenerales,
    private _builder : FormBuilder
  ) {}

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.CrearFormulario() ;

    this.ListadoCliente = new ClienteDataSource(this.Servicio);
    this.ListadoCliente.CargarClientes(false,'','', '','',4,3,1,10,1);
    this.estado=1;
    this.Columnas = this.ColumnasGeneral ;

    this.ListarInstitucion() ;
    this.ListarSede() ;

    this.route.queryParams
    .subscribe(params => {
      if( !this.nueva_consulta ) {
        if( params.documento && !this.nueva_consulta ) {
          this.ClienteForm.get('dni').setValue( params.documento ) ;
          this.ClienteForm.get('institucion').setValue(0) ;
          this.ClienteForm.get('sede').setValue(0) ;
          this.nueva_consulta = true ;

          this.ListadoCliente.CargarClientes(false,'','',this.ClienteForm.get('dni').value,'',0,0,1,10,1) ;
          if( params.ventana && this.Dialogo.openDialogs.length == 0 ) {
            this.VerVentas(params.ventana, params.nombre, false) ;
          }
        } else {
          this.ListadoCliente.CargarClientes(false,'','', '','',4,3,1,10,1);
        }
      }
    });
  }

  ngAfterViewInit() {
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
      tap(() => {
        if ( !this.nueva_consulta ) {
          this.ClienteForm.get('institucion').setValue(0) ;
          this.ClienteForm.get('sede').setValue(0) ;
        }
        this.nueva_consulta = true ;
        this.paginator.pageIndex=0 ;
        this.CargarData() ;
      })
     ).subscribe();

     this.ClienteForm.get('dni').valueChanges
     .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.AsignarQuery(0,"") ;
      })
     ).subscribe();

     this.ClienteForm.get('relacion').valueChanges
     .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.nueva_consulta = true ;
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
      institucion : [ 4 ] ,
      sede : [ 3 ] ,
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
      this.nueva_consulta ? this.ClienteForm.get('institucion').value : 4 ,
      this.nueva_consulta ? (this.ClienteForm.get('sede').value || 0) : 3 ,
      this.paginator.pageIndex+1 ,
      this.paginator.pageSize ,
      this.estado
    );
  }
  
  Agregar() {
    let VentanaClientes = this.DialogoClientes.open(VentanaEmergenteIntegralAgregarComponent, {
      width: '1200px' ,
      maxHeight : '80vh'
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
      if( res ) {
        this.CargarData();
      }
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

  AgregarObservaciones(cliente){
    let VentanaContacto = this.DialogoContacto.open(VentanaRelacionadosComponent, {
      width: '1200px',
      maxHeight : '80vh',
      data: { id_cliente: cliente.id, dni : cliente.dni, codigo : cliente.codigo }
    });

    VentanaContacto.afterClosed().subscribe(res=>{
      // if ( res ) {
      //   this.Notificacion.Snack("Se creó la observación satisfactoriamente.","")
      // }
      // if ( res===false ) {
      //   this.Notificacion.Snack("Ocurrió un error al crear la observación.","")
      // }
    })
  }

  VerVentas( id_cliente, nombre, cliente ){
    this.AsignarQuery( id_cliente, nombre ) ;
    let Ventana = this.Dialogo.open(VentanaVentasComponent, {
      width: '900px',
      data: {id: id_cliente, nombre: nombre, cliente: cliente}
    });

    Ventana.afterClosed().subscribe(res=>{
      if(res) {

      } else {
        this.AsignarQuery(0,"") ;
      }
    })
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
    let Ventana = this.DialogoClientes.open( VentanaCobranzaClienteVencidasComponent,{
      width: '900px' ,
      data: { cliente: cliente.id, por_verificar : por_verificar }
    } ) ;

    Ventana.afterClosed().subscribe(res=>{
      // console.log(res)
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

  // Esto se utiliza para estalecer los params de la URL
  AsignarQuery( id_cliente : number, nombre : string ) {
    if( this.ClienteForm.get('dni').value.length == 8 ) {
      if( id_cliente > 0 ) {
        this.router.navigate(['.'], {
          relativeTo: this.route,
          queryParams: { documento : this.ClienteForm.get('dni').value, ventana : id_cliente, nombre : nombre } ,
        });
      } else {
        this.router.navigate(['.'], {
          relativeTo: this.route,
          queryParams: { documento : this.ClienteForm.get('dni').value } ,
        });
      }
    } else {
      this.router.navigate(['.'], { relativeTo: this.route });
    }
  }

}
