"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ventanaemergente_1 = require("./ventana-emergente/ventanaemergente");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var rxjs_1 = require("rxjs");
var productos_service_1 = require("./productos.service");
var productos_dataservice_1 = require("./productos.dataservice");
var rxjs_2 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ventana_confirmar_component_1 = require("../global/ventana-confirmar/ventana-confirmar.component");
var ProductosComponent = /** @class */ (function () {
    function ProductosComponent(Servicio, DialogoProductos) {
        this.Servicio = Servicio;
        this.DialogoProductos = DialogoProductos;
        this.Columnas = ['numero', 'descripcion', 'tipo', 'marca', 'modelo', 'precio', 'opciones'];
    }
    ProductosComponent.prototype.ngOnInit = function () {
        this.ListadoProductos = new productos_dataservice_1.ProductoDataSource(this.Servicio);
        // tslint:disable-next-line:quotemark
        this.ListadoProductos.CargarProductos('', '', '', '', 1, 10, "descripcion", "asc");
    };
    // tslint:disable-next-line:use-life-cycle-interface
    ProductosComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.sort.sortChange.subscribe(function (res) {
            _this.paginator.pageIndex = 0;
        });
        rxjs_1.merge(this.paginator.page, this.sort.sortChange)
            .pipe(operators_1.tap(function () { return _this.CargarData(); })).subscribe();
        rxjs_1.merge(rxjs_2.fromEvent(this.FiltroProductos.nativeElement, 'keyup'), rxjs_2.fromEvent(this.FiltroTipo.nativeElement, 'keyup'), rxjs_2.fromEvent(this.FiltroMarca.nativeElement, 'keyup'), rxjs_2.fromEvent(this.FiltroModelo.nativeElement, 'keyup'))
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.paginator.pageIndex = 0;
            _this.CargarData();
        })).subscribe();
    };
    ProductosComponent.prototype.CargarData = function () {
        this.ListadoProductos.CargarProductos(this.FiltroTipo.nativeElement.value, this.FiltroMarca.nativeElement.value, this.FiltroModelo.nativeElement.value, this.FiltroProductos.nativeElement.value, this.paginator.pageIndex + 1, this.paginator.pageSize, this.sort.active, this.sort.direction);
    };
    /* Agregar productos */
    ProductosComponent.prototype.Agregar = function () {
        var _this = this;
        // tslint:disable-next-line:prefer-const
        var VentanaProductos = this.DialogoProductos.open(ventanaemergente_1.VentanaEmergenteProductos, {
            width: '800px'
        });
        VentanaProductos.afterClosed().subscribe(function (res) {
            _this.CargarData();
        });
    };
    /* Eliminar productos */
    ProductosComponent.prototype.Eliminar = function (producto) {
        var _this = this;
        var VentanaConfirmar = this.DialogoProductos.open(ventana_confirmar_component_1.VentanaConfirmarComponent, {
            width: '400px',
            data: { objeto: 'el producto', valor: producto.descripcion }
        });
        VentanaConfirmar.afterClosed().subscribe(function (res) {
            if (res === true) {
                // tslint:disable-next-line:no-shadowed-variable
                _this.Servicio.Eliminar(producto.id).subscribe(function (res) {
                    _this.CargarData();
                });
            }
        });
    };
    /* Editar productos */
    ProductosComponent.prototype.Editar = function (id) {
        var _this = this;
        this.Servicio.Seleccionar(id).subscribe(function (res) {
            // tslint:disable-next-line:prefer-const
            var VentanaProductos = _this.DialogoProductos.open(ventanaemergente_1.VentanaEmergenteProductos, {
                width: '800px',
                data: res
            });
            // tslint:disable-next-line:no-shadowed-variable
            VentanaProductos.afterClosed().subscribe(function (res) {
                _this.CargarData();
            });
        });
    };
    __decorate([
        core_1.ViewChild('InputProducto'),
        __metadata("design:type", core_1.ElementRef)
    ], ProductosComponent.prototype, "FiltroProductos", void 0);
    __decorate([
        core_1.ViewChild('InputTipo'),
        __metadata("design:type", core_1.ElementRef)
    ], ProductosComponent.prototype, "FiltroTipo", void 0);
    __decorate([
        core_1.ViewChild('InputMarca'),
        __metadata("design:type", core_1.ElementRef)
    ], ProductosComponent.prototype, "FiltroMarca", void 0);
    __decorate([
        core_1.ViewChild('InputModelo'),
        __metadata("design:type", core_1.ElementRef)
    ], ProductosComponent.prototype, "FiltroModelo", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], ProductosComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort),
        __metadata("design:type", material_1.MatSort)
    ], ProductosComponent.prototype, "sort", void 0);
    ProductosComponent = __decorate([
        core_1.Component({
            selector: 'app-productos',
            templateUrl: './productos.component.html',
            styleUrls: ['./productos.component.css'],
            providers: [productos_service_1.ProductoService]
        }),
        __metadata("design:paramtypes", [productos_service_1.ProductoService,
            material_1.MatDialog])
    ], ProductosComponent);
    return ProductosComponent;
}());
exports.ProductosComponent = ProductosComponent;
//# sourceMappingURL=productos.component.js.map