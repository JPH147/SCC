import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CreditosService } from '../creditos/creditos.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { CreditosDataSource } from '../creditos-listar/creditos-listar.component';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { Store } from '@ngrx/store';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CobranzaJudicialService } from 'src/app/modulo-cobranzas/cobranza-judicial/cobranza-judicial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { informacion_ventana_desafiliar, VentanaDesafiliarComponent } from './ventana-desafiliar/ventana-desafiliar.component';
import { VentanaDevolverAnexosComponent } from 'src/app/modulo-cobranzas/cobranza-judicial/ventana-devolver-anexos/ventana-devolver-anexos.component';
import { MatDialog } from '@angular/material/dialog';
import { Notificaciones } from 'src/app/core/servicios/notificacion';

@Component({
  selector: 'app-creditos-listar-afiliaciones',
  templateUrl: './creditos-listar-afiliaciones.component.html',
  styleUrls: ['./creditos-listar-afiliaciones.component.css'],
  providers : [CreditosService]
})

export class CreditosListarAfiliacionesComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public ListadoCreditos: CreditosDataSource;
  public Columnas: string[] = ['numero', 'fecha', 'codigo', 'cliente_nombre', 'documentos_adjuntos', 'monto_total', 'cuotas_pagadas' , 'ultima_fecha_pago', 'opciones'];

  public Tipos : Array<any>;
  public permiso : Rol ;

  public CreditosForm : FormGroup ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Servicio: CreditosService ,
    private _builder : FormBuilder ,
    private _route : ActivatedRoute ,
    private _router : Router ,
    private _dialogo : MatDialog ,
    private _notificacion : Notificaciones ,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListadoCreditos = new CreditosDataSource(this.Servicio);

    this.ListarTiposCredito();

    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this._route.queryParams.subscribe(params => {
      params.cliente ? this.CreditosForm.get('cliente').setValue(params.cliente) : null ;
      params.dni ? this.CreditosForm.get('dni').setValue(params.dni) : null ;
      params.tipo_credito ? this.CreditosForm.get('tipo_credito').setValue(params.tipo_credito) : null ;
      params.estado_pagos ? this.CreditosForm.get('estado_pagos').setValue(params.estado_pagos) : null ;
      params.fecha_inicio ? this.CreditosForm.get('fecha_inicio').setValue(params.fecha_inicio) : null ;
      params.fecha_fin ? this.CreditosForm.get('fecha_fin').setValue(params.fecha_fin) : null ;
      params.estado_credito ? this.CreditosForm.get('estado_credito').setValue(params.estado_credito) : null ;
      params.pagina_inicio ? this.paginator.pageIndex = params.pagina_inicio : null ;
      params.tamano_pagina ? this.paginator.pageSize = params.tamano_pagina : null ;
      params.sort_active ? this.sort.active = params.sort_active : null ;
      params.sort_direction ? this.sort.direction = params.sort_direction : null ;
      
      this.CargarData() ;
    });
  }

  ngAfterViewInit () {
    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });

    merge(
      this.CreditosForm.valueChanges ,
      this.paginator.page,
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.CargarData();
       })
    ).subscribe();
  }

  CrearFormulario() {
    this.CreditosForm = this._builder.group({
      cliente : '' ,
      dni : '' ,
      tipo_credito : 99 ,
      estado_pagos : 0 ,
      fecha_inicio : null ,
      fecha_fin : null ,
      estado_credito : 1
    })
  }

  ListarTiposCredito(){
    this.Servicio.ListarTipos().subscribe(res=>{
      this.Tipos=res;
    })
  }

  CargarData() {
    this.ListadoCreditos.CargarCreditos(
      this.CreditosForm.get('cliente').value ,
      this.CreditosForm.get('dni').value ,
      1,
      this.CreditosForm.get('estado_pagos').value ,
      this.CreditosForm.get('fecha_inicio').value ,
      this.CreditosForm.get('fecha_fin').value ,
      this.CreditosForm.get('estado_credito').value,
      this.paginator?.pageIndex ? this.paginator.pageIndex + 1 : 1 ,
      this.paginator?.pageSize ? this.paginator.pageSize : 10 ,
      this.sort ? this.sort.active +" " + this.sort.direction : "fecha desc" ,
      new Date().getTime()
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  VerCredito(id_credito) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.CreditosForm.get('cliente').value ,
        dni : this.CreditosForm.get('dni').value ,
        tipo_credito : this.CreditosForm.get('tipo_credito').value ,
        estado_pagos : this.CreditosForm.get('estado_pagos').value ,
        fecha_inicio : this.CreditosForm.get('fecha_inicio').value ,
        fecha_fin : this.CreditosForm.get('fecha_fin').value ,
        estado_credito : this.CreditosForm.get('estado_credito').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      this._router.navigate(['./ver', id_credito], {
        relativeTo: this._route
      }) ;
    });

  }

  VerProcesosJudiciales(id_credito) {
    this._router.navigate(['.'], {
      relativeTo: this._route,
      queryParams: {
        cliente : this.CreditosForm.get('cliente').value ,
        dni : this.CreditosForm.get('dni').value ,
        tipo_credito : this.CreditosForm.get('tipo_credito').value ,
        estado_pagos : this.CreditosForm.get('estado_pagos').value ,
        fecha_inicio : this.CreditosForm.get('fecha_inicio').value ,
        fecha_fin : this.CreditosForm.get('fecha_fin').value ,
        estado_credito : this.CreditosForm.get('estado_credito').value ,
        pagina_inicio : this.paginator.pageIndex ,
        tamano_pagina : this.paginator.pageSize ,
        sort_active : this.sort.active ,
        sort_direction : this.sort.direction ,
      }
    })
    .finally(() => {
      this._router.navigate(['/cobranzas','cobranza-judicial','nueva-credito',id_credito]) ;
    })
  }

  Desafiliar(id_credito) {
    const informacion : informacion_ventana_desafiliar = {
      id_credito : id_credito ,
      tipo : 'desafiliar'
    }

    const Ventana = this._dialogo.open(VentanaDesafiliarComponent, {
      data : informacion ,
      width : '900px' ,
      maxHeight : '80vh'
    })

    Ventana.afterClosed().subscribe(resultado => {
      if ( resultado ) {
        this._notificacion.Snack("Se desafilió al cliente","") ;
        this.CargarData() ;
      }
      if( !resultado ) {
        this._notificacion.Snack("Ocurrió un error desafiliando al cliente","") ;
      }
    })
  }

  Reafiliar(id_credito) {
    const informacion : informacion_ventana_desafiliar = {
      id_credito : id_credito ,
      tipo : 'reafiliar'
    }

    const Ventana = this._dialogo.open(VentanaDesafiliarComponent, {
      data : informacion ,
      width : '900px' ,
      maxHeight : '80vh'
    })

    Ventana.afterClosed().subscribe(resultado => {
      if ( resultado ) {
        this._notificacion.Snack("Se reafilió al cliente","") ;
        this.CargarData() ;
      }
      if( !resultado ) {
        this._notificacion.Snack("Ocurrió un error reafiliando al cliente","") ;
      }
    })
  }
}