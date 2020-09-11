import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

// Cookies
import { CookieService } from 'ngx-cookie-service' ;

/* Imports del software */
import {AppComponent} from './app.component';
import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ListadoSalidaVendedoresComponent } from './components/listado-salida-vendedores/listado-salida-vendedores.component';
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
import { VentanaEmergenteGastos } from './components/listado-salida-vendedores/ventana-emergente-gastos/ventanaemergente-gastos';
import { ImageUploadModule } from 'angular2-image-upload';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import { VentanaEmergenteProveedores } from './components/proveedores/ventana-emergente/ventana-emergente.component';
import { VentanaProductosComponent } from './components/ventas/ventana-productos/ventana-productos.component';
import { ComisionesDetalleComponent } from './components/comisiones/comisiones-detalle/comisiones-detalle.component';
import { VentanaCronogramaComponent } from './components/ventas/ventana-cronograma/ventana-cronograma.component';
import { AgregarVentaComponent } from './components/retorno-vendedores/agregar-venta/agregar-venta.component';
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
import { VendedoresComponent } from './components/vendedores/vendedores.component';
import { FileUploadVendedores } from './components/vendedores/vendedores-listado/file-upload/fileupload';
import { VentanaVendedorComponent } from './components/vendedores/vendedores-listado/ventana-vendedor/ventana-vendedor';
import { TalonariosComponent } from './components/talonarios/talonarios.component';
import { VentanaTalonarioComponent } from './components/talonarios/ventana-talonario/ventana-talonario.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { VentanaArchivosComponent } from './components/presupuesto/ventana-archivos/ventana-archivos.component';
import { CourierComponent } from './components/courier/courier.component';
import { VentanaCourierComponent } from './components/courier/ventana-courier/ventana-courier.component';
import { CreditosListarAfiliacionesComponent } from './components/creditos-listar-afiliaciones/creditos-listar-afiliaciones.component';
import { PlantillasComponent } from './components/plantillas/plantillas.component';
import { VentanaPlantillasComponent } from './components/plantillas/documentos/ventana-plantillas/ventana-plantillas.component';
import { RefinanciamientoComponent } from './components/refinanciamiento/refinanciamiento.component';
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
import { VentanaJudicialComponent } from './components/cobranza-judicial/ventana-judicial/ventana-judicial.component';
import { VentanaInstitucionComponent } from './components/instituciones/institucion/ventana-institucion/ventana-institucion.component';
import { VentanaSedeComponent } from './components/instituciones/sede/ventana-sede/ventana-sede.component';
import { VentanaSubsedeComponent } from './components/instituciones/subsede/ventana-subsede/ventana-subsede.component';
import { VentanaParametrosPlantillasComponent } from './components/instituciones/sede/ventana-parametros-plantillas/ventana-parametros-plantillas.component';
import { CargoComponent } from './components/instituciones/cargo/cargo.component';
import { CargoEstadoComponent } from './components/instituciones/cargo-estado/cargo-estado.component';
import { VentanaCargoEstadoComponent } from './components/instituciones/cargo-estado/ventana-cargo-estado/ventana-cargo-estado.component';
import { VentanaCargoComponent } from './components/instituciones/cargo/ventana-cargo/ventana-cargo.component';
import { VendedoresCargoComponent } from './components/vendedores/vendedores-cargo/vendedores-cargo.component';
import { VentanaVendedoresCargoComponent } from './components/vendedores/vendedores-cargo/ventana-vendedores-cargo/ventana-vendedores-cargo.component';
import { VendedoresListadoComponent } from './components/vendedores/vendedores-listado/vendedores-listado.component';
import { DistritoJudicialComponent } from './components/proceso-judicial-vinculados/distrito-judicial/distrito-judicial.component';
import { VentanaDistritoJudicialComponent } from './components/proceso-judicial-vinculados/distrito-judicial/ventana-distrito-judicial/ventana-distrito-judicial.component';
import { InstanciaJudicialComponent } from './components/proceso-judicial-vinculados/instancia-judicial/instancia-judicial.component';
import { VentanaInstanciaJudicialComponent } from './components/proceso-judicial-vinculados/instancia-judicial/ventana-instancia-judicial/ventana-instancia-judicial.component';
import { ProcesoJudicialVinculadosComponent } from './components/proceso-judicial-vinculados/proceso-judicial-vinculados.component';
import { VentanaCambioDistritoComponent } from './components/cobranza-judicial-listar/ventana-cambio-distrito/ventana-cambio-distrito.component';
import { EstadoDocumentosComponent } from './components/proceso-judicial-vinculados/estado-documentos/estado-documentos.component';
import { VentanaDocumentosComponent } from './components/proceso-judicial-vinculados/estado-documentos/ventana-documentos/ventana-documentos.component';
import { JuezJuzgadoComponent } from './components/proceso-judicial-vinculados/juez-juzgado/juez-juzgado.component';
import { VentanaJuezJuzgadoComponent } from './components/proceso-judicial-vinculados/juez-juzgado/ventana-juez-juzgado/ventana-juez-juzgado.component';
import { CobranzaJudicialMultipleComponent } from './components/cobranza-judicial-multiple/cobranza-judicial-multiple.component';
import { UsuariosListarComponent } from './components/usuarios/usuarios-listar/usuarios-listar.component';
import { PermisosListarComponent } from './components/usuarios/permisos-listar/permisos-listar.component';
import { VentanaUsuariosComponent } from './components/usuarios/usuarios-listar/ventana-usuarios/ventana-usuarios.component';
import { VentanaPermisosComponent } from './components/usuarios/permisos-listar/ventana-permisos/ventana-permisos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { VentanaCobranzaClienteComponent } from './components/cobranza-cliente-listar/ventana-cobranza-cliente/ventana-cobranza-cliente.component';
import { VentanaCobranzaClienteVencidasComponent } from './components/cobranza-cliente-listar/ventana-cobranza-cliente-vencidas/ventana-cobranza-cliente-vencidas.component';
import { CobranzaClienteListarMorososComponent } from './components/cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';

import { VentanaEditarCuotasComponent } from './components/cobranza-archivos/cobranza-pnp/ventana-editar-cuotas/ventana-editar-cuotas.component';
import { CobranzaManualComponent } from './components/cobranza-manual/cobranza-manual.component';
import { VentanaCrearCobranzaManualComponent } from './components/cobranza-manual/ventana-crear-cobranza-manual/ventana-crear-cobranza-manual.component';
import { CobranzaManualListarComponent } from './components/cobranza-manual-listar/cobranza-manual-listar.component';
import { CooperativaConfiguracionComponent } from './components/cooperativa-configuracion/cooperativa-configuracion.component';
import { CooperativaDireccionesComponent } from './components/plantillas/cooperativa-direcciones/cooperativa-direcciones.component';
import { VentanaCooperativaDireccionesComponent } from './components/plantillas/cooperativa-direcciones/ventana-cooperativa-direcciones/ventana-cooperativa-direcciones.component';
import { DocumentosComponent } from './components/plantillas/documentos/documentos.component';
import { VentanaDocumentosComponent as VentanaDocumentosComponent2 } from './components/plantillas/documentos/ventana-documentos/ventana-documentos.component';
import { AfiliacionesComponent } from './components/afiliaciones/afiliaciones.component';
import { DocumentoTransaccionComponent } from './components/plantillas/documento-transaccion/documento-transaccion.component';
import { DocumentoAutorizacionComponent } from './components/plantillas/documento-autorizacion/documento-autorizacion.component';
import { DocumentoDeclaracionComponent } from './components/plantillas/documento-declaracion/documento-declaracion.component';
import { DocumentoTarjetaComponent } from './components/plantillas/documento-tarjeta/documento-tarjeta.component';
import { DocumentoCompromisoComponent } from './components/plantillas/documento-compromiso/documento-compromiso.component';
import { DocumentoCartaComponent } from './components/plantillas/documento-carta/documento-carta.component';

import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';
import { CompartidoModule } from './compartido/compartido.module';
import { ReglasEvaluacionComponent } from './components/tablas-maestras/reglas-evaluacion/reglas-evaluacion.component';
import { StoreModule } from '@ngrx/store';
import { ReducersGlobales } from './compartido/reducers/estados';
import { ProveedoresMovimientosComponent } from './components/proveedores/proveedores-movimientos/proveedores-movimientos.component';

@NgModule({
  exports:[
    RouterModule
  ],
  imports: [
    BrowserModule ,
    BrowserAnimationsModule ,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule ,
    CoreModule ,
    CompartidoModule ,
    AppRoutingModule ,
    ImageUploadModule.forRoot(),
    StoreModule.forRoot(ReducersGlobales) ,
  ],
  declarations: [
    AppComponent,
    SalidaVendedoresComponent,
    RetornoVendedoresComponent,
    ComisionesComponent,
    VentasComponent,
    ListadoSalidaVendedoresComponent,
    ProveedoresComponent,
    ProveedoresMovimientosComponent ,
    ventanaseriessv,
    DireccionesComponent,
    DepartamentoComponent,
    ProvinciaComponent,
    DistritoComponent,
    VentanaEmergenteDepartamento,
    VentanaEmergenteProvincia,
    VentanaEmergenteDistrito,
    VentanaEmergenteGastos,
    FileUploadProveedores,
    FileUploadVendedores,
    VentasListarComponent,
    VentanaEmergenteProveedores,
    VentanaProductosComponent,
    ComisionesDetalleComponent,
    VentanaCronogramaComponent,
    AgregarVentaComponent,
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
    VendedoresComponent,
    TalonariosComponent,
    VentanaVendedorComponent,
    VentanaTalonarioComponent,
    PresupuestoComponent,
    VentanaArchivosComponent,
    CourierComponent,
    VentanaCourierComponent,
    CreditosListarAfiliacionesComponent,
    PlantillasComponent,
    VentanaPlantillasComponent,
    RefinanciamientoComponent,
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
    VentanaJudicialComponent,
    CobranzaJudicialGenerarComponent,
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
    ProcesoJudicialVinculadosComponent,
    VentanaCambioDistritoComponent,
    EstadoDocumentosComponent,
    VentanaDocumentosComponent,
    JuezJuzgadoComponent,
    VentanaJuezJuzgadoComponent,
    CobranzaJudicialMultipleComponent,
    UsuariosListarComponent,
    PermisosListarComponent,
    VentanaUsuariosComponent,
    VentanaPermisosComponent,
    UsuariosComponent,
    VentanaCobranzaClienteComponent,
    VentanaCobranzaClienteVencidasComponent,
    CobranzaClienteListarMorososComponent,
    VentanaEditarCuotasComponent,
    CobranzaManualComponent,
    VentanaCrearCobranzaManualComponent,
    CobranzaManualListarComponent,
    CooperativaConfiguracionComponent,
    CooperativaDireccionesComponent,
    VentanaCooperativaDireccionesComponent,
    DocumentosComponent,
    VentanaDocumentosComponent2,
    AfiliacionesComponent,
    DocumentoTransaccionComponent,
    DocumentoAutorizacionComponent,
    DocumentoDeclaracionComponent,
    DocumentoTarjetaComponent,
    DocumentoCompromisoComponent,
    DocumentoCartaComponent,
    ReglasEvaluacionComponent
   ],
  bootstrap: [AppComponent],
  providers: [
    CookieService ,
  ]
})



export class AppModule {}
