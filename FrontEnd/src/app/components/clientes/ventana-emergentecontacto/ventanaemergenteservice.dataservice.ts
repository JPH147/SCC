import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {catchError, finalize, debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { ClienteService } from '../clientes.service';
import {ServiciosTelefonos} from '../../global/telefonos';
import {ServiciosDirecciones} from '../../global/direcciones';
import {VentanaConfirmarComponent} from '../../global/ventana-confirmar/ventana-confirmar.component';

export class ClienteCuentaDataSource implements DataSource<any> {

  private InformacionCuentas = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: ClienteService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionCuentas.asObservable();
  }
  
  disconnect(){
    this.InformacionCuentas.complete();
    this.CargandoInformacion.complete();
  }
  
  CargarCuentas(
    id_cliente: number,
    pagina: number,
    total_pagina: number
  ){
    this.CargandoInformacion.next(true);
    this.Servicio.ListarCuenta(id_cliente, '', pagina , total_pagina)
    .pipe(catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
  		if (res['data']) {
  			this.InformacionCuentas.next(res['data'].cuentas);
  		}else{
  			this.InformacionCuentas.next([])
  		}
  		if (res['mensaje']>0) {
  			this.TotalResultados.next(res['mensaje']);
  		}else{
  			this.TotalResultados.next(0)
  		}
    });
  }
}

export class ClienteTelefonoDataSource implements DataSource<any> {

  private InformacionTelefonos = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: ServiciosTelefonos) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTelefonos.asObservable();
  }
  
  disconnect(){
    this.InformacionTelefonos.complete();
    this.CargandoInformacion.complete();
  }
  
  CargarTelefonos(
    id_cliente: number,
    pagina: number,
    total_pagina: number
  ){
    this.CargandoInformacion.next(true);
    this.Servicio.ListarTelefono(id_cliente, '',pagina,total_pagina)
    .pipe(catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if (res['data']) {
        this.InformacionTelefonos.next(res['data'].telefonos);
      }else{
        this.InformacionTelefonos.next([])
      }
      if (res['mensaje']>0) {
        this.TotalResultados.next(res['mensaje']);
      }else{
        this.TotalResultados.next(0)
      }
    });
  }
}

export class ClienteDireccionDataSource implements DataSource<any> {

  private InformacionDirecciones = new BehaviorSubject<any[]>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(private Servicio: ServiciosDirecciones) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionDirecciones.asObservable();
  }
  
  disconnect(){
    this.InformacionDirecciones.complete();
    this.CargandoInformacion.complete();
  }
  
  CargarDirecciones(
    id_cliente: number,
    pagina: number,
    total_pagina: number
  ){
    this.CargandoInformacion.next(true);
    this.Servicio.ListarDireccion(id_cliente, '',pagina,total_pagina)
    .pipe(catchError(() => of([])),
    finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if (res['data']) {
        this.InformacionDirecciones.next(res['data'].direcciones);
      }else{
        this.InformacionDirecciones.next([])
      }
      if (res['mensaje']>0) {
        this.TotalResultados.next(res['mensaje']);
      }else{
        this.TotalResultados.next(0)
      }
    });
  }
}