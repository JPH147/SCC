
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
import { DetalleProductosComponent} from './components/detalleproductos/detalleproductos.component';
import {TipoComponent} from './components/detalleproductos/tipo/tipo.component';
import { ModeloComponent } from './components/detalleproductos/modelo/modelo.component';
import { MarcaComponent } from './components/detalleproductos/marca/marca.component';

@NgModule({
  imports: [
/* Angular Material */
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
  /* Angular Material */
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
    DetalleProductosComponent,
    TipoComponent,
    MarcaComponent,
    ModeloComponent
   ],
  entryComponents: [
    AppComponent,
    VentanaEmergenteProductos,
    VentanaEmergenteArchivos,
    ventanaseries,
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
    ProveedoresMovimientosComponent
  ],
  bootstrap: [AppComponent],
  providers: [appRoutingProvider, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})

export class AppModule {}
