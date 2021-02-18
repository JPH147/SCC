import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { SeleccionarClienteComponent } from 'src/app/compartido/componentes/seleccionar-cliente/seleccionar-cliente.component';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { ClienteService } from 'src/app/modulo-clientes/clientes/clientes.service';

@Component({
  selector: 'app-ventana-adjunto',
  templateUrl: './ventana-adjunto.component.html',
  styleUrls: ['./ventana-adjunto.component.css']
})
export class VentanaAdjuntoComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public TalonarioAdjuntosForm : FormGroup ;

  public ListadoSeries : Array<any> = [] ;
  public ListadoContratos : Array<any> = [] ;

  public tiene_archivo : boolean = false ;

  public archivo : File ;
  public archivo_nombre : string = "";
  public archivo_nombre_anterior : string = "";

  public Estados : Array<any> = tipos_estado ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaAdjuntoComponent>,
    private _builder : FormBuilder ,
    private _generales : ServiciosGenerales ,
    private _ventas : ServiciosVentas ,
    private _dialogo : MatDialog ,
    private ClienteServicio: ClienteService,
  ) { }

  ngOnInit(): void {
    this.ListarTalonarioSerie() ;
    this.CrearFormulario() ;

    this.TalonarioAdjuntosForm.get('contrato').setValue(this.data.id_talonario) ;

    if ( this.data.id_cliente_adjunto ) {
      this.TalonarioAdjuntosForm.get('id_cliente').setValue( this.data.id_cliente_adjunto ) ;
      this.ObtenerClientexId(this.data.id_cliente_adjunto) ;
    }

    console.log(this.data) ;

    this.data.id_estado ? this.TalonarioAdjuntosForm.get('tipo_pago').setValue( this.data.id_estado ) : null ;
    this.data.tipo_pago_adjunto ? this.TalonarioAdjuntosForm.get('tipo_pago').setValue( this.data.tipo_pago_adjunto ) : null ;
    this.data.monto_adjunto ? this.TalonarioAdjuntosForm.get('monto').setValue( this.data.monto_adjunto ) : null ;
    this.data.fecha_adjunto ? this.TalonarioAdjuntosForm.get('fecha_inicio').setValue( this.data.fecha_adjunto ) : null ;
    this.data.cuotas_adjunto ? this.TalonarioAdjuntosForm.get('cuotas').setValue( this.data.cuotas_adjunto ) : null ;
    this.data.observacion ? this.TalonarioAdjuntosForm.get('observacion').setValue( this.data.observacion ) : null ;
    
    this.archivo_nombre_anterior = this.data.pdf_contrato ;
    this.archivo_nombre = this.data.pdf_contrato ;
  }

  ngAfterViewInit() {
    this.TalonarioAdjuntosForm.get('monto').valueChanges
    .pipe(
      debounceTime(200) ,
      distinctUntilChanged(),
      tap(()=> {
        this.TalonarioAdjuntosForm.get('fecha_inicio').setValue(null) ;
      })
    ).subscribe() ;
  }

  private CrearFormulario() {
    this.TalonarioAdjuntosForm = this._builder.group({
      talonario : [{ value : "", disabled : false },[
      ]] ,
      contrato : [{ value : "", disabled : false },[
        Validators.required
      ]] ,
      tipo_pago : [{ value : 0, disabled : false },[
        Validators.required
      ]] ,
      id_cliente : [{ value : 0, disabled : false },[
        Validators.required
      ]] ,
      cliente : [{ value : '', disabled : false },[
      ]] ,
      monto : [{ value : 0, disabled : false },[
      ]] ,
      fecha_inicio : [{ value : null, disabled : false },[
      ]] ,
      cuotas : [{ value : 0, disabled : false },[
      ]] ,
      observacion : [{ value : 0, disabled : false },[
      ]] ,
    })
  }

  ListarTalonarioSerie() {
    this._generales.ListarSerie().subscribe( res => {
      this.ListadoSeries = res;
    });
  }

  ListarTalonarioNumero() {
    this._generales.ListarNumeroTalonario(
      this.TalonarioAdjuntosForm.get('talonario').value
    ).subscribe( res => {
      this.ListadoContratos = res;
   });
  }

  SubirArchivo(archivo: FileList) {
    this.archivo = archivo.item(0);
    this.archivo_nombre = this.archivo.name ;
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = "" ;
  }

  VerificarArchivo() {
    this._ventas.ListarAdjuntosTalonario(
      this.TalonarioAdjuntosForm.get('contrato').value
    ).subscribe(res=>{
      if ( res ) {
        this.tiene_archivo = true ;
      } else {
        this.tiene_archivo = false ;
      }
    })
  }

  ObtenerClientexId(id_cliente) {
    this.ClienteServicio.Seleccionar(id_cliente).subscribe(res => {
      if (res) {
        this.TalonarioAdjuntosForm.get('cliente').setValue(res.nombre);
      }
    });
  }

  SeleccionarCliente(){
    let Ventana = this._dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.TalonarioAdjuntosForm.get('id_cliente').setValue(res.id) ;
        this.TalonarioAdjuntosForm.get('cliente').setValue(res.nombre) ;
      }
    })
  }

  RemoverCliente(){
    this.TalonarioAdjuntosForm.get('id_cliente').setValue(null) ;
    this.TalonarioAdjuntosForm.get('cliente').setValue('') ;
  }

  public Guardar() {
    this.Cargando.next(true) ;
    let random = new Date().getTime() ;

    this._generales.SubirArchivo(this.archivo).subscribe(path_archivo=>{
      this._generales.RenameFile(path_archivo['data'], random.toString() , "adjunto_express" , "venta")
      .subscribe(path_archivo=>{
        const nombre_archivo = path_archivo.mensaje ? path_archivo.mensaje : this.archivo_nombre_anterior ;

        this._ventas.CrearAdjuntosTalonario(
          this.TalonarioAdjuntosForm.get('contrato').value ,
          nombre_archivo ,
          this.TalonarioAdjuntosForm.get('tipo_pago').value ,
          this.TalonarioAdjuntosForm.get('id_cliente').value ,
          this.TalonarioAdjuntosForm.get('fecha_inicio').value ,
          this.TalonarioAdjuntosForm.get('monto').value ,
          this.TalonarioAdjuntosForm.get('cuotas').value ,
          this.TalonarioAdjuntosForm.get('observacion').value ,
        )
        .pipe(
          finalize(()=>this.Cargando.next(false))
        )
        .subscribe(res=>{
          this.ventana.close(res);
        })
      })
    })
  }
}

const tipos_estado = [
  {
    categoria : 'Pendiente' ,
    tipos : [
      { nombre : 'Planilla', valor: 1 } ,
      { nombre : 'Directo', valor: 2 } ,
      { nombre : 'Contado', valor: 3 } ,
      { nombre : 'Judicial', valor: 4 } ,
    ]
  },
  {
    categoria : 'Pasado' ,
    tipos : [
      { nombre : 'Cancelado', valor: -1 } ,
      { nombre : 'Anulado', valor: -2 } ,
      { nombre : 'Canjeado', valor: -3 } ,
      { nombre : 'No ubicado', valor: -4 } ,
    ]
  } 
];