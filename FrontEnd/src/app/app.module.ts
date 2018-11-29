
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
import { VentanaEmergenteGastos } from './components/listado-salida-vendedores/ventana-emergente/ventanaemergente';
import { VentanaEmergenteDet} from './components/listado-salida-vendedores/ventana-emergentedet/ventanaemergentedet';
import { ImageUploadModule } from 'angular2-image-upload';
import {FileUpload} from './components/clientes/file-upload/fileupload';
import {VentanaEmergenteContacto} from './components/clientes/ventana-emergentecontacto/ventanaemergentecontacto';
import {VentanaEmergenteStock } from './components/stock/ventana-emergentestock/ventanaemergentestock';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import { VentanaTalonarioComponent } from './components/salida-vendedores/ventana-talonario/ventana-talonario.component';
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
    VentanaEmergenteDet,
    FileUpload,
    VentanaEmergenteContacto,
    VentanaEmergenteStock,
    VentasListarComponent,
    VentanaTalonarioComponent,
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
    EvaluacionCuotasComponent
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
    VentanaEmergenteDet,
    FileUpload,
    VentanaEmergenteContacto,
    VentanaEmergenteStock,
    VentanaTalonarioComponent,
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
    VentanaEmergenteMarca
  ],
  bootstrap: [AppComponent],
  providers: [appRoutingProvider, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})

export class AppModule {}
