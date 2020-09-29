import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';

@Component({
  selector: 'app-ventana-adjunto',
  templateUrl: './ventana-adjunto.component.html',
  styleUrls: ['./ventana-adjunto.component.css']
})
export class VentanaAdjuntoComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public TalonarioAdjuntosForm : FormGroup ;

  public ListadoSeries : Array<any> = [] ;
  public ListadoContratos : Array<any> = [] ;

  public tiene_archivo : boolean = false ;

  public archivo : File ;
  public archivo_nombre : string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaAdjuntoComponent>,
    private _builder : FormBuilder ,
    private _generales : ServiciosGenerales ,
    private _ventas : ServiciosVentas
  ) { }

  ngOnInit(): void {
    this.ListarTalonarioSerie() ;
    this.CrearFormulario() ;

    if ( this.data ) {
      this.TalonarioAdjuntosForm.get('contrato').setValue(this.data) ;
    }
  }

  private CrearFormulario() {
    this.TalonarioAdjuntosForm = this._builder.group({
      talonario : [{ value : "", disabled : false },[
      ]] ,
      contrato : [{ value : "", disabled : false },[
        Validators.required
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

  public Guardar() {
    this.Cargando.next(true) ;
    let random = new Date().getTime() ;

    this._generales.SubirArchivo(this.archivo).subscribe(path_archivo=>{
      this._generales.RenameFile(path_archivo['data'], random.toString() , "adjunto_express" , "venta")
      .subscribe(archivo_nombre=>{
        this._ventas.CrearAdjuntosTalonario(
          this.TalonarioAdjuntosForm.get('contrato').value ,
          archivo_nombre.mensaje
        )
        .pipe(
          finalize(()=>this.Cargando.next(false))
        )
        .subscribe(res=>{
          console.log(res) ;
          this.ventana.close(res);
        })
      })
    })
  }
}
