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
var listado_salida_vendedores_service_1 = require("./listado-salida-vendedores.service");
var listado_salida_vendedores_dataservice_1 = require("./listado-salida-vendedores.dataservice");
var servicios_1 = require("../global/servicios");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ListadoSalidaVendedoresComponent = /** @class */ (function () {
    function ListadoSalidaVendedoresComponent(DialogoGasto, Dialogodetalle, Servicio, General) {
        this.DialogoGasto = DialogoGasto;
        this.Dialogodetalle = Dialogodetalle;
        this.Servicio = Servicio;
        this.General = General;
        this.displayedColumns = ['numero', 'pecosa', 'sucursal', 'fecha', 'destino', 'estado', 'opciones'];
    }
    ListadoSalidaVendedoresComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.General.ListarSucursal(null, "").subscribe(function (res) { return _this.Sucursales = res; });
        this.ListadoSalida = new listado_salida_vendedores_dataservice_1.ListadoSalidaVendedoresDataSource(this.Servicio);
        this.ListadoSalida.CargarDatos(null, null, null, null, "", null, 1, 10, "pecosa");
    };
    ListadoSalidaVendedoresComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.sort.sortChange.subscribe(function (res) {
            _this.paginator.pageIndex = 0;
        });
        rxjs_1.merge(this.paginator.page, this.sort.sortChange, rxjs_1.fromEvent(this.FiltroPecosa.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroDestino.nativeElement, 'keyup')).pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.paginator.pageIndex = 0;
            _this.CargarData();
        })).subscribe();
    };
    ListadoSalidaVendedoresComponent.prototype.CargarData = function () {
        this.ListadoSalida.CargarDatos(this.FiltroPecosa.nativeElement.value, this.FiltroSucursal.value, this.FechaInicioFiltro.nativeElement.value, this.FechaFinFiltro.nativeElement.value, this.FiltroDestino.nativeElement.value, this.FiltroEstado.value, this.paginator.pageIndex + 1, this.paginator.pageSize, this.sort.active + " " + this.sort.direction);
    };
    ListadoSalidaVendedoresComponent.prototype.CambioFiltro = function () {
        //   this.paginator.pageIndex = 0;
        this.CargarData();
    };
    __decorate([
        core_1.ViewChild('InputPecosa'),
        __metadata("design:type", core_1.ElementRef)
    ], ListadoSalidaVendedoresComponent.prototype, "FiltroPecosa", void 0);
    __decorate([
        core_1.ViewChild('InputDestino'),
        __metadata("design:type", core_1.ElementRef)
    ], ListadoSalidaVendedoresComponent.prototype, "FiltroDestino", void 0);
    __decorate([
        core_1.ViewChild('InputSucursal'),
        __metadata("design:type", material_1.MatSelect)
    ], ListadoSalidaVendedoresComponent.prototype, "FiltroSucursal", void 0);
    __decorate([
        core_1.ViewChild('InputEstado'),
        __metadata("design:type", material_1.MatSelect)
    ], ListadoSalidaVendedoresComponent.prototype, "FiltroEstado", void 0);
    __decorate([
        core_1.ViewChild('fechainicio'),
        __metadata("design:type", core_1.ElementRef)
    ], ListadoSalidaVendedoresComponent.prototype, "FechaInicioFiltro", void 0);
    __decorate([
        core_1.ViewChild('fechafin'),
        __metadata("design:type", core_1.ElementRef)
    ], ListadoSalidaVendedoresComponent.prototype, "FechaFinFiltro", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], ListadoSalidaVendedoresComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort),
        __metadata("design:type", material_1.MatSort)
    ], ListadoSalidaVendedoresComponent.prototype, "sort", void 0);
    ListadoSalidaVendedoresComponent = __decorate([
        core_1.Component({
            selector: 'app-listado-salida-vendedores',
            templateUrl: './listado-salida-vendedores.component.html',
            styleUrls: ['./listado-salida-vendedores.component.css'],
            providers: [listado_salida_vendedores_service_1.ListadoSalidaVendedoresService, servicios_1.ServiciosGenerales]
        }),
        __metadata("design:paramtypes", [material_1.MatDialog,
            material_1.MatDialog,
            listado_salida_vendedores_service_1.ListadoSalidaVendedoresService,
            servicios_1.ServiciosGenerales])
    ], ListadoSalidaVendedoresComponent);
    return ListadoSalidaVendedoresComponent;
}());
exports.ListadoSalidaVendedoresComponent = ListadoSalidaVendedoresComponent;
//# sourceMappingURL=listado-salida-vendedores.component.js.map