
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

import {routing, appRoutingProvider} from './app.routing';
import {Notificaciones} from './components/global/notificacion';

/* Imports del software */
import {AppComponent} from './app.component';
import {MenuComponent} from './menu/menu.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ProductosComponent } from './components/productos/productos.component';
import { StockComponent } from './components/stock/stock.component';
import { IngresoProductosComponent } from './components/ingreso-productos/ingreso-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ListadoSalidaVendedoresComponent } from './components/listado-salida-vendedores/listado-salida-vendedores.component';
import {VentanaEmergenteProductos} from './components/productos/ventana-emergente/ventanaemergente';
import {VentanaEmergenteArchivos} from './components/ventas/ventana-emergente/ventanaemergente';
import {ventanaseries} from './components/ingreso-productos/ventana-series/ventanaseries';
import {VentanaDetalle} from './components/ingreso-productos/ventana-detalle/ventanadetalle';
import {VentanaFecha} from './components/ingreso-productos/ventana-fecha/ventanafecha';
import { ventanaseriesalida } from './components/salida-productos/ventana-seriesalida/ventanaseriesalida';
import {VentanaEmergenteClientes} from './components/clientes/ventana-emergente/ventanaemergente';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ventanaseriessv } from './components/salida-vendedores/ventana-seriessv/ventanaseriessv';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { DepartamentoComponent } from './components/direcciones/departamento/departamento.component';
import { VentanaEmergenteDepartamento} from './components/direcciones/departamento/ventana-emergente/ventanaemergente';
import {VentanaEmergenteProvincia} from './components/direcciones/provincia/ventana-emergente/ventanaemergente';
import {VentanaEmergenteDistrito } from './components/direcciones/distrito/ventana-emergente/ventanaemergente';
import { ProvinciaComponent } from './components/direcciones/provincia/provincia.component';
import { DistritoComponent } from './components/direcciones/distrito/distrito.component';
import { VentanaConfirmarComponent } from './components/global/ventana-confirmar/ventana-confirmar.component';
import { VentanaEmergenteGastos } from './components/listado-salida-vendedores/ventana-emergente-gastos/ventanaemergente-gastos';
import { ImageUploadModule } from 'angular2-image-upload';
import {FileUpload} from './components/clientes/file-upload/fileupload';
import {VentanaEmergenteContacto} from './components/clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import {VentanaEmergenteStock } from './components/stock/ventana-emergentestock/ventanaemergentestock';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import {ImagenProductoComponent} from './components/productos/imagen-producto/imagen-producto.component';
import { HistorialSerieComponent } from './components/historial-serie/historial-serie.component';
import { ProveedoresMovimientosComponent } from './components/proveedores/proveedores-movimientos/proveedores-movimientos.component';
import { HistorialMovimientosComponent } from './components/historial-movimientos/historial-movimientos.component';
import { DetalleProductosComponent} from './components/detalleproductos/detalleproductos.component';
import {TipoComponent} from './components/detalleproductos/tipo/tipo.component';
import { ModeloComponent } from './components/detalleproductos/modelo/modelo.component';
import { MarcaComponent } from './components/detalleproductos/marca/marca.component';
import { VentanaEmergenteProveedores } from './components/proveedores/ventana-emergente/ventana-emergente.component';
import { DetalleDocumentoAlmacenComponent } from './components/detalle-documento-almacen/detalle-documento-almacen.component';
import { VentanaEditarSerieComponent } from './components/detalle-documento-almacen/ventana-editar-serie/ventana-editar-serie.component';
import { VentanaEmergenteTipo } from './components/detalleproductos/tipo/ventana-emergente/ventanaemergente';
import { VentanaEmergenteModelo } from './components/detalleproductos/modelo/ventana-emergente/ventanaemergente';
import { VentanaEmergenteMarca } from './components/detalleproductos/marca/ventana-emergente/ventanaemergente';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
import { EvaluacionCapacidadComponent } from './components/evaluacion/evaluacion-capacidad/evaluacion-capacidad.component';
import { EvaluacionCuotasComponent } from './components/evaluacion/evaluacion-cuotas/evaluacion-cuotas.component';
import { AgregarProductoComponent } from './components/evaluacion/agregar-producto/agregar-producto.component';
import { EvaluacionOrdenComponent } from './components/evaluacion/evaluacion-orden/evaluacion-orden.component';
import { VentanaProductosComponent } from './components/ventas/ventana-productos/ventana-productos.component';
import { ReglasEvaluacionComponent } from './components/tablas-maestras/reglas-evaluacion/reglas-evaluacion.component';
import { VentanaObservacionesComponent } from './components/clientes/ventana-observaciones/ventana-observaciones.component';
import { VentanaFotoComponent } from './components/clientes/ventana-foto/ventana-foto.component';
import { VentanaVentasComponent } from './components/clientes/ventana-ventas/ventana-ventas.component';
import { ComisionesDetalleComponent } from './components/comisiones/comisiones-detalle/comisiones-detalle.component';
import { VentanaCronogramaComponent } from './components/ventas/ventana-cronograma/ventana-cronograma.component';
import { AgregarVentaComponent } from './components/retorno-vendedores/agregar-venta/agregar-venta.component';
import { SeleccionarClienteComponent } from './components/retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';
import { RetornoVendedoresCierreComponent } from './components/retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import { VentasSalidaComponent } from './components/ventas-salida/ventas-salida.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { CreditosListarComponent } from './components/creditos-listar/creditos-listar.component';
import { CobranzasComponent } from './components/cobranzas/cobranzas.component';
import { CobranzasListarComponent } from './components/cobranzas-listar/cobranzas-listar.component';
import { CobranzaPnpComponent } from './components/cobranzas/cobranza-pnp/cobranza-pnp.component';
import { CobranzaArchivosComponent } from './components/cobranza-archivos/cobranza-archivos.component';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores.component';
import { RegistroHorasComponent } from './components/registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './components/reporte-asistencia/reporte-asistencia.component';

@NgModule({
  imports: [
    MatNativeDateModule,
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    LayoutModule,
    routing,
    ImageUploadModule.forRoot()
  ],
  declarations: [
    AppComponent,
    MenuComponent,
    UsuariosComponent,
    ProductosComponent,
    StockComponent,
    IngresoProductosComponent,
    SalidaProductosComponent,
    SalidaVendedoresComponent,
    RetornoVendedoresComponent,
    ComisionesComponent,
    ClientesComponent,
    VentasComponent,
    ListadoSalidaVendedoresComponent,
    VentanaEmergenteProductos,
    VentanaEmergenteArchivos,
    ventanaseries,
    VentanaFecha,
    VentanaDetalle,
    ventanaseriesalida,
    VentanaEmergenteClientes,
    ProveedoresComponent,
    ventanaseriessv,
    VentanaConfirmarComponent,
    DireccionesComponent,
    DepartamentoComponent,
    ProvinciaComponent,
    DistritoComponent,
    VentanaEmergenteDepartamento,
    VentanaEmergenteProvincia,
    VentanaEmergenteDistrito,
    VentanaEmergenteGastos,
    FileUpload,
    VentanaEmergenteContacto,
    VentanaEmergenteStock,
    VentasListarComponent,
    ImagenProductoComponent,
    HistorialSerieComponent,
    ProveedoresMovimientosComponent,
    HistorialMovimientosComponent,
    DetalleProductosComponent,
    TipoComponent,
    MarcaComponent,
    ModeloComponent,
    DetalleDocumentoAlmacenComponent,
    VentanaEditarSerieComponent,
    VentanaEmergenteTipo,
    VentanaEmergenteProveedores,
    DetalleDocumentoAlmacenComponent,
    VentanaEditarSerieComponent,
    VentanaEmergenteTipo,
    DetalleDocumentoAlmacenComponent,
    VentanaEditarSerieComponent,
    VentanaEmergenteTipo,
    VentanaEmergenteModelo,
    VentanaEmergenteMarca,
    EvaluacionComponent,
    EvaluacionCapacidadComponent,
    EvaluacionCuotasComponent,
    AgregarProductoComponent,
    EvaluacionOrdenComponent,
    VentanaProductosComponent,
    ReglasEvaluacionComponent,
    VentanaObservacionesComponent,
    VentanaFotoComponent,
    VentanaVentasComponent,
    ComisionesDetalleComponent,
    VentanaCronogramaComponent,
    AgregarVentaComponent,
    SeleccionarClienteComponent,
    RetornoVendedoresCierreComponent,
    VentasSalidaComponent,
    CreditosComponent,
    CreditosListarComponent,
    CobranzasComponent,
    CobranzasListarComponent,
    CobranzaPnpComponent,
    CobranzaArchivosComponent,
    TrabajadoresComponent,
    RegistroHorasComponent,
    ReporteAsistenciaComponent
   ],
  entryComponents: [
    AppComponent,
    VentanaEmergenteProductos,
    VentanaEmergenteArchivos,
    ventanaseries,
    VentanaDetalle,
    VentanaFecha,
    ventanaseriesalida,
    VentanaEmergenteClientes,
    ventanaseriessv,
    VentanaConfirmarComponent,
    VentanaEmergenteDepartamento,
    VentanaEmergenteProvincia,
    VentanaEmergenteDistrito,
    VentanaEmergenteGastos,
    FileUpload,
    VentanaEmergenteContacto,
    VentanaEmergenteStock,
    VentasComponent,
    ImagenProductoComponent,
    ProveedoresMovimientosComponent,
    VentanaEditarSerieComponent,
    VentanaEmergenteTipo,
    VentanaEmergenteProveedores,
    VentanaEditarSerieComponent,
    VentanaEmergenteTipo,
    VentanaEditarSerieComponent,
    VentanaEmergenteTipo,
    VentanaEmergenteModelo,
    VentanaEmergenteMarca,
    AgregarProductoComponent,
    VentanaProductosComponent,
    VentanaObservacionesComponent,
    VentanaFotoComponent,
    VentanaVentasComponent,
    ComisionesDetalleComponent,
    VentanaCronogramaComponent,
    AgregarVentaComponent,
    SeleccionarClienteComponent
  ],
  bootstrap: [AppComponent],
  providers: [appRoutingProvider, Notificaciones,{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})

export class AppModule {}
