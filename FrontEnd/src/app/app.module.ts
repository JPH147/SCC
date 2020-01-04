
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE} from '@angular/material/core';
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
  MatPaginatorIntl
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { Configuracion } from '../paginador_espanol';
// import { FileSelectDirective } from 'ng2-file-upload';

import { RouterModule } from '@angular/router';
import {appRoutes} from './app.routing';
import {Notificaciones} from './components/global/notificacion';
import { ServiciosGenerales } from './components/global/servicios';

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
import {ventanaseries} from './components/ingreso-productos/ventana-series/ventanaseries';
import {VentanaDetalle} from './components/ingreso-productos/ventana-detalle/ventanadetalle';
import {VentanaFecha} from './components/ingreso-productos/ventana-fecha/ventanafecha';
import { ventanaseriesalida } from './components/salida-productos/ventana-seriesalida/ventanaseriesalida';
import {VentanaEmergenteClientes} from './components/clientes/ventana-emergente/ventanaemergente';
import { VentanaEmergenteProvisionalClientes } from './components/clientes/ventana-emergente-provisional/ventanaemergenteprovisional';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { FileUploadProveedores } from './components/proveedores/file-upload/fileupload';
import { ventanaseriessv } from './components/salida-vendedores/ventana-seriessv/ventanaseriessv';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { DepartamentoComponent } from './components/direcciones/departamento/departamento.component';
import { ProvinciaComponent } from './components/direcciones/provincia/provincia.component';
import { DistritoComponent } from './components/direcciones/distrito/distrito.component';
import { VentanaEmergenteDepartamento} from './components/direcciones/departamento/ventana-emergente/ventanaemergente';
import {VentanaEmergenteProvincia} from './components/direcciones/provincia/ventana-emergente/ventanaemergente';
import {VentanaEmergenteDistrito } from './components/direcciones/distrito/ventana-emergente/ventanaemergente';
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
import { CobranzasListarComponent } from './components/cobranzas-listar/cobranzas-listar.component';
import { CobranzaPnpComponent } from './components/cobranza-archivos/cobranza-pnp/cobranza-pnp.component';
import { CobranzaArchivosListarComponent } from './components/cobranza-archivos-listar/cobranza-archivos-listar.component';
import { CobranzaArchivosComponent } from './components/cobranza-archivos/cobranza-archivos.component';
import { CobranzaArchivosPagoComponent } from './components/cobranza-archivos-pago/cobranza-archivos-pago.component';
import { VentanaTrabajadoresComponent } from './components/trabajadores/ventana-trabajador/ventana-trabajador.component';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores.component';
import { RegistroHorasComponent } from './components/registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './components/reporte-asistencia/reporte-asistencia.component';
import { ConsultarClienteComponent } from './components/clientes/consultar-cliente/consultar-cliente.component';
import { VendedoresComponent } from './components/vendedores/vendedores.component';
import { FileUploadVendedores } from './components/vendedores-listado/file-upload/fileupload';
import { VentanaVendedorComponent } from './components/vendedores-listado/ventana-vendedor/ventana-vendedor';
import { TalonariosComponent } from './components/talonarios/talonarios.component';
import { VentanaTalonarioComponent } from './components/talonarios/ventana-talonario/ventana-talonario.component';
import { EvaluacionArchivosComponent } from './components/evaluacion/evaluacion-archivos/evaluacion-archivos.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { VentanaArchivosComponent } from './components/presupuesto/ventana-archivos/ventana-archivos.component';
import { SeguimientosComponent } from './components/seguimientos/seguimientos.component';
import { VentanaSeguimientosComponent } from './components/seguimientos/ventana-seguimientos/ventana-seguimientos.component';
import { VentanaEntregaSeguimientosComponent } from './components/seguimientos/ventana-entrega-seguimientos/ventana-entrega-seguimientos.component';
import { CourierComponent } from './components/courier/courier.component';
import { VentanaCourierComponent } from './components/courier/ventana-courier/ventana-courier.component';
import { CreditosListarAfiliacionesComponent } from './components/creditos-listar-afiliaciones/creditos-listar-afiliaciones.component';
import { PlantillasComponent } from './components/plantillas/plantillas.component';
import { VentanaPlantillasComponent } from './components/plantillas/ventana-plantillas/ventana-plantillas.component';
import { RefinanciamientoComponent } from './components/refinanciamiento/refinanciamiento.component';
import { VerPlantillasComponent } from './components/evaluacion/ver-plantillas/ver-plantillas.component';
import { CobranzaDirectaComponent } from './components/cobranza-directa/cobranza-directa.component';
import { CobranzaDirectaListarComponent } from './components/cobranza-directa-listar/cobranza-directa-listar.component';
import { VentanaPagosComponent } from './components/cobranzas-listar/ventana-pagos/ventana-pagos.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';
import { InstitucionComponent } from './components/instituciones/institucion/institucion.component';
import { SedeComponent } from './components/instituciones/sede/sede.component';
import { SubsedeComponent } from './components/instituciones/subsede/subsede.component';
import { VentanaTipoReporteComponent } from './components/cobranzas-listar/ventana-tipo-reporte/ventana-tipo-reporte.component';
import { VentanaEditarPagoComponent } from './components/cobranzas-listar/ventana-editar-pago/ventana-editar-pago.component';
import { CobranzaArchivosDetalleComponent } from './components/cobranza-archivos-detalle/cobranza-archivos-detalle.component';
import { CobranzaJudicialListarComponent } from './components/cobranza-judicial-listar/cobranza-judicial-listar.component';
import { CobranzaJudicialComponent } from './components/cobranza-judicial/cobranza-judicial.component';
import { CobranzaJudicialGenerarComponent } from './components/cobranza-judicial-generar/cobranza-judicial-generar.component';
import { CobranzaClienteListarComponent } from './components/cobranza-cliente-listar/cobranza-cliente-listar.component';
import { EvaluacionExpressComponent } from './components/evaluacion/evaluacion-express/evaluacion-express.component';
import { VentanaJudicialComponent } from './components/cobranza-judicial/ventana-judicial/ventana-judicial.component';
import { VentanaEditarDocumentoComponent } from './components/detalle-documento-almacen/ventana-editar-documento/ventana-editar-documento.component';
import { VentanaInstitucionComponent } from './components/instituciones/institucion/ventana-institucion/ventana-institucion.component';
import { VentanaSedeComponent } from './components/instituciones/sede/ventana-sede/ventana-sede.component';
import { VentanaSubsedeComponent } from './components/instituciones/subsede/ventana-subsede/ventana-subsede.component';
import { VentanaParametrosPlantillasComponent } from './components/instituciones/sede/ventana-parametros-plantillas/ventana-parametros-plantillas.component';
import { CargoComponent } from './components/instituciones/cargo/cargo.component';
import { CargoEstadoComponent } from './components/instituciones/cargo-estado/cargo-estado.component';
import { VentanaCargoEstadoComponent } from './components/instituciones/cargo-estado/ventana-cargo-estado/ventana-cargo-estado.component';
import { VentanaCargoComponent } from './components/instituciones/cargo/ventana-cargo/ventana-cargo.component';
import { VendedoresCargoComponent } from './components/vendedores-cargo/vendedores-cargo.component';
import { VentanaVendedoresCargoComponent } from './components/vendedores-cargo/ventana-vendedores-cargo/ventana-vendedores-cargo.component';
import { VendedoresListadoComponent } from './components/vendedores-listado/vendedores-listado.component';
import { DistritoJudicialComponent } from './components/proceso-judicial-vinculados/distrito-judicial/distrito-judicial.component';
import { VentanaDistritoJudicialComponent } from './components/proceso-judicial-vinculados/distrito-judicial/ventana-distrito-judicial/ventana-distrito-judicial.component';
import { InstanciaJudicialComponent } from './components/proceso-judicial-vinculados/instancia-judicial/instancia-judicial.component';
import { VentanaInstanciaJudicialComponent } from './components/proceso-judicial-vinculados/instancia-judicial/ventana-instancia-judicial/ventana-instancia-judicial.component';
import { ProcesoJudicialVinculadosComponent } from './components/proceso-judicial-vinculados/proceso-judicial-vinculados.component';

@NgModule({
  exports:[
    RouterModule
  ],
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
    RouterModule.forRoot(appRoutes),
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
    ventanaseries,
    VentanaFecha,
    VentanaDetalle,
    ventanaseriesalida,
    VentanaEmergenteClientes,
    VentanaEmergenteProvisionalClientes,
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
    FileUploadProveedores,
    FileUploadVendedores,
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
    CobranzaArchivosComponent,
    CobranzasListarComponent,
    CobranzaPnpComponent,
    CobranzaArchivosListarComponent,
    TrabajadoresComponent,
    RegistroHorasComponent,
    ReporteAsistenciaComponent,
    VentanaTrabajadoresComponent,
    ConsultarClienteComponent,
    VendedoresComponent,
    TalonariosComponent,
    VentanaVendedorComponent,
    VentanaTalonarioComponent,
    EvaluacionArchivosComponent,
    PresupuestoComponent,
    VentanaArchivosComponent,
    SeguimientosComponent,
    VentanaSeguimientosComponent,
    VentanaEntregaSeguimientosComponent,
    CourierComponent,
    VentanaCourierComponent,
    CreditosListarAfiliacionesComponent,
    PlantillasComponent,
    VentanaPlantillasComponent,
    RefinanciamientoComponent,
    VerPlantillasComponent,
    CobranzaDirectaComponent,
    CobranzaDirectaListarComponent,
    VentanaPagosComponent,
    InstitucionesComponent,
    InstitucionComponent,
    SedeComponent,
    SubsedeComponent,
    CobranzaArchivosPagoComponent,
    VentanaTipoReporteComponent,
    VentanaEditarPagoComponent,
    CobranzaArchivosDetalleComponent,
    CobranzaJudicialListarComponent,
    CobranzaJudicialComponent,
    CobranzaClienteListarComponent,
    EvaluacionExpressComponent,
    VentanaJudicialComponent,
    CobranzaJudicialGenerarComponent,
    VentanaEditarDocumentoComponent,
    VentanaInstitucionComponent,
    VentanaSedeComponent,
    VentanaSubsedeComponent,
    VentanaParametrosPlantillasComponent,
    CargoComponent,
    CargoEstadoComponent,
    VentanaCargoEstadoComponent,
    VentanaCargoComponent,
    VendedoresCargoComponent,
    VentanaVendedoresCargoComponent,
    VendedoresListadoComponent,
    DistritoJudicialComponent,
    VentanaDistritoJudicialComponent,
    InstanciaJudicialComponent,
    VentanaInstanciaJudicialComponent,
    ProcesoJudicialVinculadosComponent
   ],
  entryComponents: [
    AppComponent,
    VentanaEmergenteProductos,
    ventanaseries,
    VentanaDetalle,
    VentanaFecha,
    ventanaseriesalida,
    VentanaEmergenteClientes,
    VentanaEmergenteProvisionalClientes,
    ventanaseriessv,
    VentanaConfirmarComponent,
    VentanaEmergenteDepartamento,
    VentanaEmergenteProvincia,
    VentanaEmergenteDistrito,
    VentanaEmergenteGastos,
    FileUpload,
    FileUploadProveedores,
    FileUploadVendedores,
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
    SeleccionarClienteComponent,
    VentanaTrabajadoresComponent,
    VentanaVendedorComponent,
    VentanaTalonarioComponent,
    VentanaArchivosComponent,
    VentanaSeguimientosComponent,
    VentanaEntregaSeguimientosComponent,
    VentanaCourierComponent,
    VentanaPlantillasComponent,
    VerPlantillasComponent,
    VentanaPagosComponent,
    VentanaTipoReporteComponent,
    VentanaEditarPagoComponent,
    VentanaJudicialComponent,
    VentanaEditarDocumentoComponent,
    VentanaInstitucionComponent,
    VentanaSedeComponent,
    VentanaSubsedeComponent,
    VentanaParametrosPlantillasComponent,
    VentanaCargoEstadoComponent,
    VentanaCargoComponent,
    VentanaVendedoresCargoComponent,
    VentanaDistritoJudicialComponent,
    VentanaInstanciaJudicialComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    Notificaciones,
    ServiciosGenerales,
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    { provide: MatPaginatorIntl, useValue: Configuracion() }
  ]
})

export class AppModule {}
