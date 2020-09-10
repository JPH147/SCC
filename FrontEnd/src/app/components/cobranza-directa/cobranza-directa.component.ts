import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { fromEvent, BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { URLIMAGENES } from 'src/app/core/servicios/url';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { SeleccionarClienteComponent } from '../../compartido/componentes/seleccionar-cliente/seleccionar-cliente.component';
import { VentaService } from '../ventas/ventas.service';

import * as moment from 'moment' ;

@Component({
  selector: 'app-cobranza-directa',
  templateUrl: './cobranza-directa.component.html',
  styleUrls: ['./cobranza-directa.component.scss'],
})

export class CobranzaDirectaComponent implements OnInit, AfterViewInit {

  @ViewChild('InputMonto', { static: true }) FiltroMonto : ElementRef ;
  @ViewChild('InputOperacion', { static: true }) FiltroOperacion : ElementRef ;

  public Cargando = new BehaviorSubject<boolean>(false);
  public CobranzaDirectaForm : FormGroup ;
  public Cuotas : Array<any> = [] ;
  public cuentas : Array<any> ;
  public editar_cuotas : number = 3 ;
  public total_cuotas_editado : number ;
  public diferencia : number ;
  public enviado : boolean = false ;
  public id_cobranza : number ;
  public id_cobranza_editar : number ;
  public no_hay_cuotas : boolean ;
  public pago_excedente : boolean = false ;

  public ruta : string = URLIMAGENES.urlimages;
  public voucher_repetido : boolean = false ;
  public archivo : string = "" ;
  public archivo_editar : boolean = false ;
  public archivo_antiguo : string ;
  public archivo_nuevo : string = "" ;

  public Documentos : Array<any> = [] ; // Esta variable contiene los documentos por cliente

  constructor(
    private Builder : FormBuilder ,
    private Dialogo : MatDialog ,
    private router : Router ,
    private route : ActivatedRoute ,
    private location : Location ,
    private ServiciosGenerales : ServiciosGenerales ,
    private Notificacion : Notificaciones ,
    private Servicio : CobranzasService ,
    private _ventas : VentaService ,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListarCuentas() ;

    this.route.params.subscribe(params=>{
      if(Object.keys(params).length>0){

        if( params['idcobranza'] ){
          this.id_cobranza = params['idcobranza'];
          // this.id_cobranza = 2 ;
          this.SeleccionarCobranza(this.id_cobranza);
        }

        if( params['idcobranzaeditar'] ){
          this.id_cobranza_editar = params['idcobranzaeditar'];
          // this.id_cobranza_editar = 2 ;
          this.SeleccionarCobranza(this.id_cobranza_editar);
        }

      }
    })

  }

  ngAfterViewInit(){
    fromEvent(this.FiltroMonto.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if(!this.id_cobranza){
          this.ListarPosiblesCuotas();
        }
      })
    ).subscribe();

    fromEvent(this.FiltroOperacion.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if(!this.id_cobranza && !this.id_cobranza_editar){
          this.VerificarVoucher();
        }
      })
    ).subscribe();
  }

  CrearFormulario(){
    this.CobranzaDirectaForm = this.Builder.group({
      id_cliente: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
      cliente: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
      fecha: [ { value : new Date() , disabled : false } , [
        Validators.required
      ] ],
      cuenta_bancaria: [ { value : 1 , disabled : false } , [
        Validators.required
      ] ],
      numero_operacion: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
      monto: [ { value : null , disabled : false } , [
        Validators.required,
        Validators.min(1),
        Validators.pattern ('[0-9- ]+')
      ] ],
      solo_directas: [ { value : true , disabled : false } , [
      ] ],
      documento: [ { value : 0 , disabled : false } , [
      ] ],
      observaciones: [ { value : "" , disabled : false } , [
      ] ],
      interes: [ { value : false , disabled : false } , [
      ] ],
      fecha_referencia: [ { value : null , disabled : true } , [
      ] ],
    })
  }

  SeleccionarCobranza(id_cobranza){
    this.enviado = true ;
    this.Servicio.SeleccionarCobranzaDirecta(id_cobranza).subscribe(res=>{
      this.enviado = false ;
      this.CobranzaDirectaForm.get('id_cliente').setValue(res.id_cliente) ;
      this.ListarTransacciones() ;
      this.CobranzaDirectaForm.get('cliente').setValue(res.cliente) ;
      this.CobranzaDirectaForm.get('fecha').setValue(moment(res.fecha).toDate()) ;

      this.CobranzaDirectaForm.get('documento').setValue(res.id_transaccion) ;

      if (res.fecha_referencia) {
        this.CobranzaDirectaForm.get('interes').setValue( true ) ;
        this.CobranzaDirectaForm.get('fecha_referencia').enable()
        this.CobranzaDirectaForm.get('fecha_referencia').setValue(res.fecha_referencia) ;
      }

      this.CobranzaDirectaForm.get('numero_operacion').setValue(res.numero_operacion) ;
      this.CobranzaDirectaForm.get('monto').setValue(res.monto) ;
      this.CobranzaDirectaForm.get('observaciones').setValue( res.observaciones ? res.observaciones : "No hay observaciones" ) ;
      this.CobranzaDirectaForm.get('solo_directas').setValue(res.solo_directas) ;

      res.archivo != "" ? this.archivo = URLIMAGENES.carpeta+'cobranza/'+ res.archivo : null ;

      if( this.id_cobranza ) {
        this.CobranzaDirectaForm.get('cuenta_bancaria').setValue(res.banco) ;
        this.CobranzaDirectaForm.get('solo_directas').disable() ;
        this.CobranzaDirectaForm.get('interes').disable() ;
        this.CobranzaDirectaForm.get('fecha_referencia').disable() ;
        this.CobranzaDirectaForm.get('documento').disable() ;

        this.Cuotas = res.detalle ;
      }

      if( this.id_cobranza_editar ) {
        this.CobranzaDirectaForm.get('cuenta_bancaria').setValue(res.cooperativa_cuenta);

        this.archivo_antiguo = res.archivo;
        res.archivo != "" ? this.archivo_editar=false : this.archivo_editar=true ;

        this.Cuotas = res.detalle ;
        this.Cuotas.forEach((item)=>{
          item.monto_pendiente = item.monto_pendiente + item.monto ;
        });

      }

    })
  }

  ListarTransacciones(){
    this._ventas.ListarVentasxCliente(
      this.CobranzaDirectaForm.get('id_cliente').value ,
      "" ,
      new Date() ,
      0 ,
      1 ,
      50
    ).subscribe(transacciones=>{
      // console.log(ventas) ;
      this.Documentos = transacciones['data'].ventas ;
    })
  }

  ListarCuentas(){
    this.Servicio.ListarCuentas().subscribe(res=>{
      this.cuentas = res['data'].cuentas;
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CobranzaDirectaForm.get('id_cliente').setValue(res.id);
        this.CobranzaDirectaForm.get('cliente').setValue(res.nombre);
        this.ListarTransacciones() ;
        if( this.CobranzaDirectaForm.value.monto ) {
          this.ListarPosiblesCuotas() ;
        }
      }
    })
  }

  RemoverCliente(){
    this.CobranzaDirectaForm.get('id_cliente').setValue(null);
    this.CobranzaDirectaForm.get('cliente').setValue(null);
    this.Cuotas = [] ;
    this.Documentos = [] ;
  }

  DocumentoSeleccionado(){
    // console.log( this.CobranzaDirectaForm.get('id_cliente').value, this.CobranzaDirectaForm.get('documento').value ) ;
    if ( this.CobranzaDirectaForm.get('documento').value == 0 ) {
      this.CobranzaDirectaForm.get('solo_directas').setValue( true ) ;
      this.CobranzaDirectaForm.get('solo_directas').enable() ;
    } else {
      this.CobranzaDirectaForm.get('solo_directas').setValue( false ) ;
      this.CobranzaDirectaForm.get('solo_directas').disable() ;
    }
    this.ListarPosiblesCuotas() ;
  }

  InteresSeleccionado(){
    if ( this.CobranzaDirectaForm.get('interes').value ) {
      if( !this.CobranzaDirectaForm.get('fecha_referencia').value ) {
        this.CobranzaDirectaForm.get('fecha_referencia').setValue(new Date()) ;
      }
      this.CobranzaDirectaForm.get('fecha_referencia').enable() ;
    } else {
      this.CobranzaDirectaForm.get('fecha_referencia').disable() ;
    }
    this.ListarPosiblesCuotas() ;
  }

  ListarPosiblesCuotas(){
    if( !this.id_cobranza ) {
      if( this.CobranzaDirectaForm.get('monto').valid && this.CobranzaDirectaForm.value.id_cliente ) {
  
        this.Cargando.next(true);
        this.Cuotas = [] ;
        let monto : number = this.CobranzaDirectaForm.get('monto').value ;
  
        if( !this.id_cobranza_editar ) {
          this.Servicio.ListarPosiblesCuotas(
            this.CobranzaDirectaForm.get('id_cliente').value,
            this.CobranzaDirectaForm.get('monto').value,
            this.CobranzaDirectaForm.get('documento').value,
            this.CobranzaDirectaForm.get('solo_directas').value || false ,
            this.CobranzaDirectaForm.get('interes').value ? this.CobranzaDirectaForm.get('fecha_referencia').value : null ,
          ).subscribe(res=>{
            this.Cargando.next(false) ;
            if(res['data']){
              this.Cuotas = res['data'].cuotas ;
              this.Cuotas.forEach((item)=>{
                if( monto > item.monto_pendiente ){
                  item.pagar = item.monto_pendiente ;
                  monto = monto - item.monto_pendiente ;
                  monto = Math.round(monto*100)/100 ;
                } else {
                  item.pagar = monto ;
                }
              });
              this.CalcularTotalPorPagar();
              this.no_hay_cuotas = false ;
            } else {
              this.no_hay_cuotas = true ;
            }
          })
        }
  
        if( this.id_cobranza_editar ) {
          this.Servicio.ListarPosiblesCuotasSinDirecta(
            this.CobranzaDirectaForm.get('id_cliente').value,
            this.CobranzaDirectaForm.get('monto').value,
            this.CobranzaDirectaForm.get('documento').value,
            this.CobranzaDirectaForm.get('solo_directas').value || false ,
            this.CobranzaDirectaForm.get('interes').value ? this.CobranzaDirectaForm.get('fecha_referencia').value : null ,
            this.id_cobranza_editar
          ).subscribe(res=>{
            this.Cargando.next(false) ;
            if(res['data']){
              this.Cuotas = res['data'].cuotas ;
              this.Cuotas.forEach((item)=>{
                console.log(item) ;
                if( monto > item.monto_pendiente ){
                  item.pagar = item.monto_pendiente ;
                  monto = monto - item.monto_pendiente ;
                  monto = Math.round(monto*100)/100 ;
                } else {
                  item.pagar = monto ;
                }
              })
              this.CalcularTotalPorPagar();
              this.no_hay_cuotas = false ;
            } else {
              this.no_hay_cuotas = true ;
            }
          })
        }
        }
    }
  }

  EditarCuotas(estado){
    this.editar_cuotas=estado;
    this.CalcularTotalPorPagar();
  }

  CalcularTotalPorPagar(){
    this.total_cuotas_editado=0;

    this.pago_excedente = this.Cuotas.some(item=>item.pagar>item.monto_pendiente) ;

    this.Cuotas.forEach((item)=>{
      this.total_cuotas_editado=this.total_cuotas_editado+1*item.pagar ;
    })
    this.diferencia = Math.abs(Math.round((this.CobranzaDirectaForm.value.monto-this.total_cuotas_editado)*100)/100);
  }

  SubirVoucher(evento){
    if( !this.id_cobranza_editar ) this.archivo = evento.serverResponse.response.body.data ;
    if( this.id_cobranza_editar ) this.archivo_nuevo = evento.serverResponse.response.body.data ;
  }

  AbrirDocumento(url){
    if(url){
      window.open(url, "_blank");
    }
  }

  VerificarVoucher(){
    this.Servicio.BuscarNumeroOperacion(this.FiltroOperacion.nativeElement.value).subscribe(res=>{
      this.voucher_repetido=res;
    })
  }

  Atras(){
    this.location.back();
  }

  Guardar(){
    if( !this.id_cobranza && !this.id_cobranza_editar ) {
      this.CrearCobranza()
    }
    
    if( this.id_cobranza_editar ) {
      this.ActualizarCobranza()
    }
  }

  CrearCobranza() {

    this.enviado = true ;
    let random = (new Date()).getTime();

    forkJoin(
      this.Servicio.BuscarNumeroOperacion(this.FiltroOperacion.nativeElement.value),
      this.ServiciosGenerales.RenameFile(this.archivo,'VOUCHER',random.toString(),"cobranza")
    )
    .subscribe(respuesta=>{
      if( respuesta[0] ) {
        this.voucher_repetido=respuesta[0];
        this.enviado = false ;
      } else {
        this.Servicio.CrearCobranzaDirecta(
          this.CobranzaDirectaForm.value.fecha ,
          this.CobranzaDirectaForm.value.id_cliente ,
          this.CobranzaDirectaForm.value.cuenta_bancaria ,
          this.CobranzaDirectaForm.value.numero_operacion ,
          this.CobranzaDirectaForm.value.monto ,
          this.CobranzaDirectaForm.value.documento ,
          this.CobranzaDirectaForm.value.solo_directas ,
          respuesta[1].mensaje,
          this.CobranzaDirectaForm.get('interes').value ? this.CobranzaDirectaForm.get('fecha_referencia').value : null ,
          this.CobranzaDirectaForm.value.observaciones,
          this.Cuotas
        ).subscribe(res=>{
          if(res['codigo']==0){
            // En caso haya habido un cambio en el interés, se deben actualizar las cuotas para que todo cuadre
            let cuotas_actualizar : Array<Observable<any>> = [] ;

            this.Cuotas.map( item => {
              if( item.interes != item.interes_considerado ) {
                let interes_exceso = item.interes_considerado - item.interes ;
                cuotas_actualizar.push(this.Servicio.ActualizarInteresCronograma(item.id_tipo, item.id, item.id_cronograma,interes_exceso))
              }
              return item ;
            })

            if ( cuotas_actualizar.length > 0 ) {
              forkJoin( cuotas_actualizar ).subscribe(res=>{console.log(res)}) ;
            }
            //// ------------<

            setTimeout(()=>{
              this.router.navigate(['/cobranza-directa']);
              this.Notificacion.Snack("Se creó la cobranza con éxito!","");
            }, 500)
          } else {
            this.router.navigate(['/cobranza-directa']);
            this.Notificacion.Snack("Ocurrió un error al crear la cobranza.", "")
          }
        })
      }
    })    
   
  }

  ActualizarCobranza(){

    this.enviado = true ;

    let random = (new Date()).getTime();

    this.ServiciosGenerales.RenameFile(this.archivo_nuevo,'VOUCHER',random.toString(),"cobranza").subscribe(resultado=>{
      if(resultado.mensaje || this.archivo_nuevo=="") {
        this.Servicio.ActualizarCobranzaDirecta(
          this.id_cobranza_editar,
          this.CobranzaDirectaForm.value.fecha ,
          this.CobranzaDirectaForm.value.id_cliente ,
          this.CobranzaDirectaForm.value.cuenta_bancaria ,
          this.CobranzaDirectaForm.value.numero_operacion ,
          this.CobranzaDirectaForm.value.monto ,
          this.CobranzaDirectaForm.value.documento ,
          this.CobranzaDirectaForm.value.solo_directas ,
          this.archivo_editar ? resultado.mensaje : this.archivo_antiguo,
          this.CobranzaDirectaForm.get('interes').value ? this.CobranzaDirectaForm.get('fecha_referencia').value : null ,
          this.CobranzaDirectaForm.value.observaciones,
          this.Cuotas
        ).subscribe(res=>{
          if(res['codigo']==0){
            // En caso haya habido un cambio en el interés, se deben actualizar las cuotas para que todo cuadre
            let cuotas_actualizar : Array<Observable<any>> = [] ;

            this.Cuotas.map( item => {
              if( item.interes != item.interes_considerado ) {
                let interes_exceso = item.interes_considerado - item.interes ;
                cuotas_actualizar.push(this.Servicio.ActualizarInteresCronograma(item.id_tipo, item.id, item.id_cronograma,interes_exceso))
              }
              return item ;
            })

            if ( cuotas_actualizar.length > 0 ) {
              forkJoin( cuotas_actualizar ).subscribe(res=>{console.log(res)}) ;
            }
            //// ------------<

            setTimeout(()=>{
              this.router.navigate(['/cobranza-directa']);
              this.Notificacion.Snack("Se actualizó la cobranza con éxito!","");
            }, 500)
          } else {
            this.router.navigate(['/cobranza-directa']);
            this.Notificacion.Snack("Ocurrió un error al actualizar la cobranza.", "")
          }
        })
      } else {
        this.router.navigate(['/cobranza-directa']);
        this.Notificacion.Snack("Ocurrió un error al subir el archivo.", "")
      }
    })

  }

}
