import { Component, OnInit } from '@angular/core';
import {MatDialog } from '@angular/material';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {SalidaVendedoresService} from '../salida-vendedores/salida-vendedores.service';
import {AgregarVentaComponent} from './agregar-venta/agregar-venta.component';

@Component({
  selector: 'app-retorno-vendedores',
  templateUrl: './retorno-vendedores.component.html',
  styleUrls: ['./retorno-vendedores.component.scss'],
  providers: [SalidaVendedoresService]
})

export class RetornoVendedoresComponent implements OnInit {

  public pecosa:string;
  public guia:string;
  public fecha_salida:Date;
  public fecha_retorno:Date;
  public destino:string;
  public observacion:string;
  public Vendedores: Array<any>;
  public Talonarios: Array<any>;

  constructor(
    private location: Location,
    private DialogoAgregar: MatDialog,
    private route: ActivatedRoute,
    private Servicio: SalidaVendedoresService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['idsalida']){
        this.Servicio.SeleccionarSalida(params['idsalida']).subscribe(res=>{
          console.log(res)
          this.pecosa=res['data'].pecosa;
          this.guia=res['data'].guia;
          this.fecha_salida=res['data'].fecha;
          this.fecha_retorno=new Date();
          this.destino=res['data'].destino;
          this.observacion=res['data'].observacion=="" ? "No hay observaciones" : res['data'].observacion;
          this.Vendedores=res['data'].vendedores.vendedores;
          this.Talonarios=res['data'].talonarios.talonarios
        })
      }
    })
  }

  RegistrarVenta(){
    const serieventana = this.DialogoAgregar.open(AgregarVentaComponent, {
      width: '1200px',
      data: {talonarios: this.Talonarios}
    });
  }
    
  Atras(){
    this.location.back()
  }

}

