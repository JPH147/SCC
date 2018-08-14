"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
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
var listado_salida_vendedores_component_1 = require("./components/listado-salida-vendedores/listado-salida-vendedores.component");
var proveedores_component_1 = require("./components/proveedores/proveedores.component");
var direcciones_component_1 = require("./components/direcciones/direcciones.component");
var ventas_listar_component_1 = require("./components/ventas-listar/ventas-listar.component");
var appRoutes = [
    { path: 'usuarios', component: usuarios_component_1.UsuariosComponent },
    { path: 'productos', component: productos_component_1.ProductosComponent },
    { path: 'stock', component: stock_component_1.StockComponent },
    { path: 'stock/ingresoproductos', component: ingreso_productos_component_1.IngresoProductosComponent },
    { path: 'stock/salidaproductos', component: salida_productos_component_1.SalidaProductosComponent },
    { path: 'salidavendedores', component: listado_salida_vendedores_component_1.ListadoSalidaVendedoresComponent },
    { path: 'salidavendedores/ingreso', component: salida_vendedores_component_1.SalidaVendedoresComponent },
    { path: 'salidavendedores/retorno', component: retorno_vendedores_component_1.RetornoVendedoresComponent },
    { path: 'retornovendedores', component: retorno_vendedores_component_1.RetornoVendedoresComponent },
    { path: 'comisiones', component: comisiones_component_1.ComisionesComponent },
    { path: 'clientes', component: clientes_component_1.ClientesComponent },
    { path: 'ventas', component: ventas_listar_component_1.VentasListarComponent },
    { path: 'ventas/nueva', component: ventas_component_1.VentasComponent },
    { path: 'usuarios', component: usuarios_component_1.UsuariosComponent },
    { path: 'proveedores', component: proveedores_component_1.ProveedoresComponent },
    { path: 'direcciones', component: direcciones_component_1.DireccionesComponent },
];
exports.appRoutingProvider = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map