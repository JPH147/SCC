import {CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Proveedor, ProveedorService} from './proveedor.service';
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