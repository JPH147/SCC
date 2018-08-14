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
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var rxjs_1 = require("rxjs");
var productos_service_1 = require("../productos/productos.service");
var ventas_listar_dataservice_1 = require("./ventas-listar.dataservice");
var operators_1 = require("rxjs/operators");
var ventas_listar_service_1 = require("./ventas-listar.service");
var VentasListarComponent = /** @class */ (function () {
    function VentasListarComponent(
    //private Servicio: ProductoService,
    DialogoProductos, Servicio) {
        this.DialogoProductos = DialogoProductos;
        this.Servicio = Servicio;
        this.Columnas = ['numero', 'serie', 'contrato', 'cliente_nombre', 'tipo_venta', 'monto_total', 'fecha', 'opciones'];
    }
    VentasListarComponent.prototype.ngOnInit = function () {
        this.ListadoVentas = new ventas_listar_dataservice_1.VentaDataSource(this.Servicio);
        this.ListadoVentas.CargarProductos("", null, null, null, 1, 10, "serie asc");
    };
    // tslint:disable-next-line:use-life-cycle-interface
    VentasListarComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.sort.sortChange.subscribe(function (res) {
            _this.paginator.pageIndex = 0;
        });
        rxjs_1.merge(this.paginator.page, this.sort.sortChange)
            .pipe(operators_1.tap(function () { return _this.CargarData(); })).subscribe();
        rxjs_1.fromEvent(this.FiltroCliente.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.paginator.pageIndex = 0;
            _this.CargarData();
        })).subscribe();
    };
    VentasListarComponent.prototype.CargarData = function () {
        this.ListadoVentas.CargarProductos(this.FiltroCliente.nativeElement.value, this.FiltroTipo.value, this.FechaInicioFiltro.nativeElement.value, this.FechaFinFiltro.nativeElement.value, this.paginator.pageIndex + 1, this.paginator.pageSize, this.sort.active + " " + this.sort.direction);
    };
    VentasListarComponent.prototype.CambioFiltro = function () {
        this.paginator.pageIndex = 0;
        this.CargarData();
    };
    __decorate([
        core_1.ViewChild('InputCliente'),
        __metadata("design:type", core_1.ElementRef)
    ], VentasListarComponent.prototype, "FiltroCliente", void 0);
    __decorate([
        core_1.ViewChild('InputTipo'),
        __metadata("design:type", material_1.MatSelect)
    ], VentasListarComponent.prototype, "FiltroTipo", void 0);
    __decorate([
        core_1.ViewChild('fechainicio'),
        __metadata("design:type", core_1.ElementRef)
    ], VentasListarComponent.prototype, "FechaInicioFiltro", void 0);
    __decorate([
        core_1.ViewChild('fechafin'),
        __metadata("design:type", core_1.ElementRef)
    ], VentasListarComponent.prototype, "FechaFinFiltro", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], VentasListarComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort),
        __metadata("design:type", material_1.MatSort)
    ], VentasListarComponent.prototype, "sort", void 0);
    VentasListarComponent = __decorate([
        core_1.Component({
            selector: 'app-ventas-listar',
            templateUrl: './ventas-listar.component.html',
            styleUrls: ['./ventas-listar.component.css'],
            providers: [ventas_listar_service_1.VentasServicio, productos_service_1.ProductoService]
        }),
        __metadata("design:paramtypes", [material_1.MatDialog,
            ventas_listar_service_1.VentasServicio])
    ], VentasListarComponent);
    return VentasListarComponent;
}());
exports.VentasListarComponent = VentasListarComponent;
//# sourceMappingURL=ventas-listar.component.js.map