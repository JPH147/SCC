import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of , BehaviorSubject } from 'rxjs';
import { catchError , finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { MatDialog } from '@angular/material';
import { SeleccionarClienteComponent } from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
// import { ServiciosTelefonos } from '../global/telefonos';
// import { ServiciosDirecciones } from '../global/direcciones';
import { RefinanciamientoService } from './refinanciamiento.service';

@Component({
  selector: 'app-refinanciamiento',
  templateUrl: './refinanciamiento.component.html',
  styleUrls: ['./refinanciamiento.component.scss'],
  providers : [ ]
})

export class RefinanciamientoComponent implements OnInit {

  public RefinanciamientoSeleccionForm : FormGroup ;
  public Transacciones : Array<any> ;

  public Listadotransacciones : RefinanciamientoDataSource ;
  public Columnas : Array<string> ;

  constructor(
    private Dialogo : MatDialog ,
    private Builder : FormBuilder ,
    private router : Router ,
    private location: Location,
    private Servicio : RefinanciamientoService ,
  ) { }

  ngOnInit() {
    this.CrearFormulario();

    this.Columnas = [ "numero" , "considerar" , "fecha" , "tipo" , "documento" , "monto_pendiente" ] ;
    this.Listadotransacciones = new RefinanciamientoDataSource(this.Servicio);

  }

  CrearFormulario(){
    this.CrearFormularioSeleccion();
  }

  CrearFormularioSeleccion(){
    this.RefinanciamientoSeleccionForm = this.Builder.group({
      id_cliente : [ { value : null , disabled : false },[
        Validators.required
      ] ],
      cliente_nombre : [ { value : null , disabled : false },[
      ] ],
      total : [ { value : 0 , disabled : false }, [
        Validators.min(1)
      ] ]
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        this.RefinanciamientoSeleccionForm.get('id_cliente').setValue(res.id);
        this.RefinanciamientoSeleccionForm.get('cliente_nombre').setValue(res.nombre);
      }
    })
  }

  RemoverCliente(){
    this.RefinanciamientoSeleccionForm.get('id_cliente').setValue(null);
    this.RefinanciamientoSeleccionForm.get('cliente_nombre').setValue("");

    this.RefinanciamientoSeleccionForm.get('total').setValue(0) ;
  }

  TransaccionSeleccionada(evento, id) {
    // console.log(evento, id) ;
    this.Listadotransacciones.InformacionTransacciones.value.forEach((item)=>{
      if(item.id==id) {
        item.considerar=evento.checked;
        return ;
      }
    })

    this.CalcularTotal() ;

  }

  CalcularTotal(){

    let total : number = 0 ;
    let monto : number ;

    this.Listadotransacciones.InformacionTransacciones.value.forEach( (item)=>{
      monto = item.considerar ? item.monto_pendiente : 0 ;
      total = total + monto ;
    }) ;

    this.RefinanciamientoSeleccionForm.get('total').setValue(total) ;
    this.SeleccionarTransaccionesConsideradas();
  }

  SeleccionarTransaccionesConsideradas(){
    this.Transacciones = [] ;
    this.Listadotransacciones.InformacionTransacciones.value.forEach( (item)=>{
      if(item.considerar) {
        this.Transacciones.push({tipo: item.id_tipo, id: item.id});
      }
    }) ;
  }

  BuscarTransacciones(){
    this.Listadotransacciones.CargarInformacion(this.RefinanciamientoSeleccionForm.value.id_cliente);
    this.RefinanciamientoSeleccionForm.get('total').setValue(0);
  }

  TransaccionesSelecionadas(){
    this.Transacciones.forEach((item)=>{
      
    })
  }

  Guardar(){
    this.router.navigate(['/creditos' , 'nuevo' , 'refinanciamiento', this.RefinanciamientoSeleccionForm.value.id_cliente, this.RefinanciamientoSeleccionForm.value.total, JSON.stringify(this.Transacciones)])
  }

  Atras(){
    this.location.back()
  }

}

export class RefinanciamientoDataSource implements DataSource<any> {

  public InformacionTransacciones = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: RefinanciamientoService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTransacciones.asObservable();
  }

  disconnect() {
    this.InformacionTransacciones.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    cliente:number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarTransacciones( cliente )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionTransacciones.next(res['data'].transacciones);
    });
  }

}