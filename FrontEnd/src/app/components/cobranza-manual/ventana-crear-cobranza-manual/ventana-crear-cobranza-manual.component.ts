import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { CobranzasService } from '../../cobranzas-listar/cobranzas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiciosGenerales } from '../../global/servicios';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, finalize } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ventana-crear-cobranza-manual',
  templateUrl: './ventana-crear-cobranza-manual.component.html',
  styleUrls: ['./ventana-crear-cobranza-manual.component.css']
})
export class VentanaCrearCobranzaManualComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  @ViewChild('Vendedor') VendedorAutoComplete : ElementRef ;

  public CobranzaForm : FormGroup ;
  public Tipos : Array<any> ;
  public Vendedores : Array<any> ;
  public error_monto : boolean = false ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaCrearCobranzaManualComponent> ,
    private _builder : FormBuilder ,
    private _generales: ServiciosGenerales ,
    private _cobranzas : CobranzasService ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;
    this.ListarTiposCobranza() ;
    this.ListarVendedor("") ;

    this.CobranzaForm.get('id_cliente').setValue(this.data.cliente) ;
    this.CobranzaForm.get('monto').setValidators([Validators.required, Validators.max(this.data.pendiente), Validators.min(0)])
  }

  ngAfterViewInit(){
    fromEvent(this.VendedorAutoComplete.nativeElement, 'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        if( this.VendedorAutoComplete.nativeElement.value ){
          this.ListarVendedor(this.VendedorAutoComplete.nativeElement.value);
        }
      })
     ).subscribe();

     this.CobranzaForm.get('monto').valueChanges
     .pipe(
       debounceTime(10),
       distinctUntilChanged(),
       tap(() => {
         this.error_monto = false ;
       })
      ).subscribe();
  }

  CrearFormulario(){
    this.CobranzaForm = this._builder.group({
      id_cliente : [ { value : null, disabled :false },[
        Validators.required ,
      ] ] ,
      tipo_cobranza : [ { value : null, disabled :false },[
        Validators.required ,
      ] ] ,
      comprobante : [ { value : null, disabled :false },[
        Validators.required ,
      ] ] ,
      id_vendedor : [ { value : null, disabled :false },[
        Validators.required ,
      ] ] ,
      vendedor : [ { value : null, disabled :false },[
      ] ] ,
      fecha : [ { value : new Date(), disabled :false },[
      ] ] ,
      monto : [ { value : 0, disabled :false },[
        Validators.required ,
        Validators.pattern(/^\d+\./)
      ] ] ,
      observaciones : [ { value : null, disabled :false },[
        Validators.required ,
      ] ]
    })
  }

  ListarTiposCobranza(){
    this._cobranzas.ListarTiposCobranzaManual("", 1, 50).subscribe(res=>{
      this.Tipos = res['data'].tipos ;
    })
  }

  ListarVendedor(nombre: string) {
    this._generales.ListarVendedor("",nombre,"",1,50).subscribe( res => {
      this.Vendedores = res;
    });
  }

  VendedorSeleccionado(){
    let nombre_vendedor= this.CobranzaForm.value.vendedor.nombre;
    this.CobranzaForm.get('id_vendedor').setValue(this.CobranzaForm.value.vendedor.id);
    this.CobranzaForm.get('vendedor').setValue(nombre_vendedor);
  }
  
  RemoverVendedor(){
    this.CobranzaForm.get('id_vendedor').setValue(null);
    this.CobranzaForm.get('vendedor').setValue("");
    this.ListarVendedor("");
  }

  Guardar(){
    if ( this.CobranzaForm.get('monto').value > 0 ) {
      this.Cargando.next(true) ;
  
      this._cobranzas.CrearCobranzaManual(
        this.CobranzaForm.get('id_cliente').value ,
        this.CobranzaForm.get('tipo_cobranza').value ,
        this.CobranzaForm.get('fecha').value ,
        this.CobranzaForm.get('comprobante').value ,
        this.CobranzaForm.get('id_vendedor').value ,
        this.CobranzaForm.get('monto').value ,
        this.CobranzaForm.get('observaciones').value
      )
      .subscribe(res=>{
        this._cobranzas.CrearDetalleCobranza(
          0 ,
          0 ,
          0 ,
          res['data'] ,
          this.data.tipo == 1 ? this.data.cronograma : 0 ,
          this.data.tipo == 2 ? this.data.cronograma : 0 ,
          this.CobranzaForm.get('monto').value ,
          this.CobranzaForm.get('fecha').value
        )
        .pipe(
          finalize(()=>{
            this.Cargando.next(false) ;
          })
        )
        .subscribe(res=>{
          if( res['codigo'] == 0 ) {
            this.ventana.close(true) ;
          } else {
            this.ventana.close(false) ;
          }
        })
      })
    } else {
      this.error_monto = true ;
    }
  }

}
