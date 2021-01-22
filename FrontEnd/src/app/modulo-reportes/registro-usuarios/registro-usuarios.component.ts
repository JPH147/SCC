import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { UsuariosService } from 'src/app/modulo-maestro/usuarios/usuarios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VentanaJudicialComponent } from 'src/app/modulo-cobranzas/cobranza-judicial/ventana-judicial/ventana-judicial.component';
import { MatDialog } from '@angular/material/dialog';
import { VentanaSeguimientosComponent } from 'src/app/modulo-clientes/ventana-seguimientos/ventana-seguimientos.component';

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.css']
})
export class RegistroUsuariosComponent implements OnInit {

  public ListadoRegistro: RegistroDataSource;
  public Columnas: string[] = ['numero', 'usuario', 'fecha', 'accion', 'referencia', 'nombre_referencia', 'opciones'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public RegistroForm : FormGroup ;

  constructor(
    private _router : Router ,
    private _dialogo : MatDialog ,
    private _builder : FormBuilder ,
    private _usuarios: UsuariosService ,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;

    this.ListadoRegistro = new RegistroDataSource(this._usuarios);
    this.CargarData() ;
  }

  ngAfterViewInit () {
    merge(
      this.paginator.page,
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      this.RegistroForm.get('usuario').valueChanges ,
      this.RegistroForm.get('accion').valueChanges ,
      this.RegistroForm.get('fecha_inicio').valueChanges ,
      this.RegistroForm.get('fecha_fin').valueChanges ,
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.paginator.pageIndex = 0;
         this.CargarData();
       })
    ).subscribe();
  }

  CrearFormulario() {
    this.RegistroForm = this._builder.group({
      usuario : [{value : "", disabled: false},[
      ]] ,
      accion : [{value : -1, disabled: false},[
      ]] ,
      fecha_inicio : [{value : new Date((new Date()).valueOf() - 1000*60*60*24*60) , disabled: false},[
      ]] ,
      fecha_fin : [{value : new Date() , disabled: false},[
      ]] ,
    })
  }

  CargarData() {
    this.ListadoRegistro.CargarInformacion(
      this.RegistroForm.get('usuario').value ,
      this.RegistroForm.get('accion').value ,
      this.RegistroForm.get('fecha_inicio').value ,
      this.RegistroForm.get('fecha_fin').value ,
      this.paginator.pageIndex+1 || 1,
      this.paginator.pageSize || 10
    );
  }

  VerDetalle(log) {
    if ( log.tabla_referenciada == 'proceso_judicial' ) {
      this._router.navigate(['/cobranzas','cobranza-judicial','ver',log.id_referencia])
    }

    if ( log.tabla_referenciada == 'proceso_judicial_detalle' ) {
      this._dialogo.open(VentanaJudicialComponent,{
        data: { ver_proceso_detalle : log.id_referencia } ,
        width: '900px'
      });
    }

    if ( log.tabla_referenciada == 'venta' ) {
      this._router.navigate(['/ventas','ventas',log.id_referencia])
    }

    if ( log.tabla_referenciada == 'seguimiento_documentos' ) {
      this._dialogo.open( VentanaSeguimientosComponent ,{
        data : { ver: true , id : log.id_referencia },
        width : '900px'
      } )
    }

    if ( log.tabla_referenciada == 'salida_cabecera' ) {
      this._router.navigate(['/ventas','salidavendedores','ver',log.id_referencia])
    }

    if ( log.tabla_referenciada == 'creditos' ) {
      this._router.navigate(['/creditos','creditos','ver',log.id_referencia])
    }

    if ( log.tabla_referenciada == 'creditos-afiliaciones' ) {
      this._router.navigate(['/creditos','afiliaciones','ver',log.id_referencia])
    }

    if ( log.tabla_referenciada == 'cobranza_archivos_cabecera' ) {
      this._router.navigate(['/cobranzas','cobranza-archivos','ver',log.id_referencia])
    }

    if ( log.tabla_referenciada == 'cobranza_directa' ) {
      this._router.navigate(['/cobranzas','cobranza-directa','ver',log.id_referencia])
    }

    if ( log.tabla_referenciada == 'cobranza_manual' ) {
      this._router.navigate(['/cobranzas','cobranza-manual','ver',log.id_referencia])
    }
  }
}

export class RegistroDataSource implements DataSource<any> {

  private InformacionRegistros = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private _usuarios: UsuariosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionRegistros.asObservable();
  }

  disconnect() {
  this.InformacionRegistros.complete();
  this.CargandoInformacion.complete();
  }

  CargarInformacion(
    usuario : string,
    accion : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    numero_pagina : number,
    total_pagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this._usuarios.ListarLogs( usuario, accion, fecha_inicio, fecha_fin, numero_pagina, total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if ( res ) {
        this.TotalResultados.next(res['mensaje']);
        this.InformacionRegistros.next(res['data'].logs);
      } else {
        this.TotalResultados.next(0);
        this.InformacionRegistros.next([]);
      }
    });
  }
}
