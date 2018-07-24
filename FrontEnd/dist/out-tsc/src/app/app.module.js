"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var table_1 = require("@angular/cdk/table");
var tree_1 = require("@angular/cdk/tree");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var platform_browser_1 = require("@angular/platform-browser");
var animations_1 = require("@angular/platform-browser/animations");
var layout_1 = require("@angular/cdk/layout");
var app_routing_1 = require("./app.routing");
/* Imports del software */
var app_component_1 = require("./app.component");
var menu_component_1 = require("./menu/menu.component");
var usuarios_component_1 = require("./components/usuarios/usuarios.component");
var productos_component_1 = require("./components/productos/productos.component");
var stock_component_1 = require("./components/stock/stock.component");
var ingreso_productos_component_1 = require("./components/ingreso-productos/ingreso-productos.component");
var salida_productos_component_1 = require("./components/salida-productos/salida-productos.component");
var salida_vendedores_component_1 = require("./components/salida-vendedores/salida-vendedores.component");
var retorno_vendedores_component_1 = require("./components/retorno-vendedores/retorno-vendedores.component");
var comisiones_component_1 = require("./components/comisiones/comisiones.component");
var clientes_component_1 = require("./components/clientes/clientes.component");
var ventas_component_1 = require("./components/ventas/ventas.component");
var salida_vendedores_component_2 = require("./components/salida-vendedores/salida-vendedores.component");
var listado_salida_vendedores_component_1 = require("./components/listado-salida-vendedores/listado-salida-vendedores.component");
var ventanaemergente_1 = require("./components/productos/ventana-emergente/ventanaemergente");
var ventanaseries_1 = require("./components/ingreso-productos/ventana-series/ventanaseries");
var ventanaseriesalida_1 = require("./components/salida-productos/ventana-seriesalida/ventanaseriesalida");
var ventanaemergente_2 = require("./components/clientes/ventana-emergente/ventanaemergente");
var proveedores_component_1 = require("./components/proveedores/proveedores.component");
var ventanaseriessv_1 = require("./components/salida-vendedores/ventana-seriessv/ventanaseriessv");
var ventana_confirmar_component_1 = require("./components/productos/ventana-confirmar/ventana-confirmar.component");
var direcciones_component_1 = require("./components/direcciones/direcciones.component");
var departamento_component_1 = require("./components/direcciones/departamento/departamento.component");
var ventanaemergente_3 = require("./components/direcciones/departamento/ventana-emergente/ventanaemergente");
var ventana_confirmar_component_2 = require("./components/direcciones/departamento/ventana-confirmar/ventana-confirmar.component");
var provincia_component_1 = require("./components/direcciones/provincia/provincia.component");
var distrito_component_1 = require("./components/direcciones/distrito/distrito.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                /* Angular Material */
                table_1.CdkTableModule,
                tree_1.CdkTreeModule,
                material_1.MatAutocompleteModule,
                material_1.MatBadgeModule,
                material_1.MatBottomSheetModule,
                material_1.MatButtonModule,
                material_1.MatButtonToggleModule,
                material_1.MatCardModule,
                material_1.MatCheckboxModule,
                material_1.MatChipsModule,
                material_1.MatStepperModule,
                material_1.MatDatepickerModule,
                material_1.MatDialogModule,
                material_1.MatDividerModule,
                material_1.MatExpansionModule,
                material_1.MatGridListModule,
                material_1.MatIconModule,
                material_1.MatInputModule,
                material_1.MatListModule,
                material_1.MatMenuModule,
                material_1.MatNativeDateModule,
                material_1.MatPaginatorModule,
                material_1.MatProgressBarModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatRadioModule,
                material_1.MatRippleModule,
                material_1.MatSelectModule,
                material_1.MatSidenavModule,
                material_1.MatSliderModule,
                material_1.MatSlideToggleModule,
                material_1.MatSnackBarModule,
                material_1.MatSortModule,
                material_1.MatTableModule,
                material_1.MatTabsModule,
                material_1.MatToolbarModule,
                material_1.MatTooltipModule,
                material_1.MatTreeModule,
                /* Angular Material */
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                forms_1.FormsModule,
                http_1.HttpClientModule,
                material_1.MatNativeDateModule,
                forms_1.ReactiveFormsModule,
                layout_1.LayoutModule,
                app_routing_1.routing,
            ],
            declarations: [
                app_component_1.AppComponent,
                menu_component_1.MenuComponent,
                usuarios_component_1.UsuariosComponent,
                productos_component_1.ProductosComponent,
                stock_component_1.StockComponent,
                ingreso_productos_component_1.IngresoProductosComponent,
                salida_productos_component_1.SalidaProductosComponent,
                salida_vendedores_component_1.SalidaVendedoresComponent,
                retorno_vendedores_component_1.RetornoVendedoresComponent,
                comisiones_component_1.ComisionesComponent,
                clientes_component_1.ClientesComponent,
                ventas_component_1.VentasComponent,
                salida_vendedores_component_2.DialogoComponent,
                listado_salida_vendedores_component_1.ListadoSalidaVendedoresComponent,
                ventanaemergente_1.VentanaEmergenteProductos,
                ventanaseries_1.ventanaseries,
                ventanaseriesalida_1.ventanaseriesalida,
                ventanaemergente_2.VentanaEmergenteClientes,
                proveedores_component_1.ProveedoresComponent,
                ventanaseriessv_1.ventanaseriessv,
                ventana_confirmar_component_1.VentanaConfirmarComponent,
                direcciones_component_1.DireccionesComponent,
                departamento_component_1.DepartamentoComponent,
                provincia_component_1.ProvinciaComponent,
                distrito_component_1.DistritoComponent,
                ventanaemergente_3.VentanaEmergenteDepartamento,
                ventana_confirmar_component_2.VentanaEliminarDepartamento
            ],
            entryComponents: [
                app_component_1.AppComponent,
                salida_vendedores_component_2.DialogoComponent,
                ventanaemergente_1.VentanaEmergenteProductos,
                ventanaseries_1.ventanaseries,
                ventanaseriesalida_1.ventanaseriesalida,
                ventanaemergente_2.VentanaEmergenteClientes,
                ventanaseriessv_1.ventanaseriessv,
                ventana_confirmar_component_1.VentanaConfirmarComponent,
                ventanaemergente_3.VentanaEmergenteDepartamento,
                ventana_confirmar_component_2.VentanaEliminarDepartamento
            ],
            bootstrap: [app_component_1.AppComponent],
            providers: [app_routing_1.appRoutingProvider]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map