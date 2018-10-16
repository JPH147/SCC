import {CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Proveedor, ProveedorService} from './proveedores.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class ProveedorDataSource implements DataSource<Proveedor> {

    private InformacionProveedores = new BehaviorSubject<Proveedor[]>([]);
    private CargandoInformacion = new BehaviorSubject<boolean>(false);
    public Cargando = this.CargandoInformacion.asObservable();

    constructor (private Servicio: ProveedorService) {}

    connect(CollectionViewer: CollectionViewer): Observable<Proveedor[]> {
        return this.InformacionProveedores.asObservable();
    }

    disconnect(){
        this.InformacionProveedores.complete();
        this.CargandoInformacion.complete();
    }

    CargarProveedores(
        ruc: string,
        nombre: string
    ){
        this.CargandoInformacion.next(true);
        this.Servicio.Listado(ruc, nombre)
        .pipe(catchError(() => of([])),
        finalize(() => this.CargandoInformacion.next(false))
        )
        .subscribe(res => this.InformacionProveedores.next(res));
    }

}

export class MovimientosProveedorDataSource implements DataSource<any> {

    private InformacionProveedores = new BehaviorSubject<any[]>([]);
    private CargandoInformacion = new BehaviorSubject<boolean>(false);
    public TotalResultado = new BehaviorSubject<number>(0);
    public Cargando = this.CargandoInformacion.asObservable();

    constructor (private Servicio: ProveedorService) {}

    connect(CollectionViewer: CollectionViewer): Observable<any[]> {
        return this.InformacionProveedores.asObservable();
    }

    disconnect(){
        this.InformacionProveedores.complete();
        this.CargandoInformacion.complete();
    }

    CargarMovimientos(
        id_proveedor:number,
        serie:string,
        producto:string,
        fecha_inicio:Date,
        fecha_fin:Date,
        pagina_inicio: number,
        total_pagina: number
    ){
        this.CargandoInformacion.next(true);
        this.Servicio.ListarMovimientos(id_proveedor,serie,producto,fecha_inicio,fecha_fin,pagina_inicio,total_pagina)
        .pipe(catchError(() => of([])),
        finalize(() => this.CargandoInformacion.next(false))
        )
        .subscribe(res => {
          this.InformacionProveedores.next(res['data'].transacciones);
          this.TotalResultado.next(res['mensaje'])
        });
    }

}