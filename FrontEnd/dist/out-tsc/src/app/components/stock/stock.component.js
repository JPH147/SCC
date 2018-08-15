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
var stock_service_1 = require("./stock.service");
var stock_dataservice_1 = require("./stock.dataservice");
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ventanaemergentestock_1 = require("./ventana-emergentestock/ventanaemergentestock");
var StockComponent = /** @class */ (function () {
    function StockComponent(http, Servicio, DialogoStock) {
        this.http = http;
        this.Servicio = Servicio;
        this.DialogoStock = DialogoStock;
        this.displayedColumns = ['numero', 'almacen', 'tipo', 'marca', 'modelo', 'descripcion', 'unidad_medida', 'cantidad', 'opciones'];
        this.TotalResultados = 0;
    }
    StockComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.Listadodata = new stock_dataservice_1.StockDataSource(this.Servicio);
        this.Listadodata.CargarStock('', '', '', '', '', 1, 20, 'descripcion asc');
        this.Listadodata.Totalresultados.subscribe(function (res) {
            _this.TotalResultados = res;
        });
    };
    // tslint:disable-next-line:use-life-cycle-interface
    StockComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.sort.sortChange.subscribe(function (res) {
            _this.paginator.pageIndex = 0;
        });
        rxjs_1.merge(this.paginator.page, this.sort.sortChange)
            .pipe(operators_1.tap(function () { return _this.CargarData(); })).subscribe();
        rxjs_1.merge(rxjs_1.fromEvent(this.FiltroAlmacen.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroTipo.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroMarca.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroModelo.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroDescripcion.nativeElement, 'keyup'))
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.paginator.pageIndex = 0;
            _this.CargarData();
        })).subscribe();
    };
    StockComponent.prototype.CargarData = function () {
        this.Listadodata.CargarStock(this.FiltroAlmacen.nativeElement.value, this.FiltroTipo.nativeElement.value, this.FiltroMarca.nativeElement.value, this.FiltroModelo.nativeElement.value, this.FiltroDescripcion.nativeElement.value, this.paginator.pageIndex + 1, this.paginator.pageSize, this.sort.active + ' ' + this.sort.direction
        // 'descripcion asc'
        );
    };
    StockComponent.prototype.DetalleStock = function (id) {
        var _this = this;
        var VentanaDetalleStock = this.DialogoStock.open(ventanaemergentestock_1.VentanaEmergenteStock, {
            width: '600px',
            data: id
        });
        VentanaDetalleStock.afterClosed().subscribe(function (res) {
            _this.CargarData();
        });
    };
    __decorate([
        core_1.ViewChild('InputAlmacen'),
        __metadata("design:type", core_1.ElementRef)
    ], StockComponent.prototype, "FiltroAlmacen", void 0);
    __decorate([
        core_1.ViewChild('InputTipo'),
        __metadata("design:type", core_1.ElementRef)
    ], StockComponent.prototype, "FiltroTipo", void 0);
    __decorate([
        core_1.ViewChild('InputMarca'),
        __metadata("design:type", core_1.ElementRef)
    ], StockComponent.prototype, "FiltroMarca", void 0);
    __decorate([
        core_1.ViewChild('InputModelo'),
        __metadata("design:type", core_1.ElementRef)
    ], StockComponent.prototype, "FiltroModelo", void 0);
    __decorate([
        core_1.ViewChild('InputDescripcion'),
        __metadata("design:type", core_1.ElementRef)
    ], StockComponent.prototype, "FiltroDescripcion", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], StockComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort),
        __metadata("design:type", material_1.MatSort)
    ], StockComponent.prototype, "sort", void 0);
    StockComponent = __decorate([
        core_1.Component({
            selector: 'app-stock',
            templateUrl: './stock.component.html',
            styleUrls: ['./stock.component.css'],
            providers: [stock_service_1.StockService]
        }),
        __metadata("design:paramtypes", [http_1.HttpClient,
            stock_service_1.StockService,
            material_1.MatDialog])
    ], StockComponent);
    return StockComponent;
}());
exports.StockComponent = StockComponent;
/** An example database that the data source uses to retrieve data for the table. */
//# sourceMappingURL=stock.component.js.map