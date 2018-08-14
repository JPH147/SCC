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
var direcciones_1 = require("../../global/direcciones");
var rxjs_1 = require("rxjs");
var distrito_dataservice_1 = require("./distrito.dataservice");
var operators_1 = require("rxjs/operators");
var material_1 = require("@angular/material");
var ventana_confirmar_component_1 = require("../../global/ventana-confirmar/ventana-confirmar.component");
var ventanaemergente_1 = require("./ventana-emergente/ventanaemergente");
var DistritoComponent = /** @class */ (function () {
    function DistritoComponent(Servicio, DialogoDistritos) {
        this.Servicio = Servicio;
        this.DialogoDistritos = DialogoDistritos;
        this.Columnas = ['numero', 'departamento', 'provincia', 'nombre', 'opciones'];
        this.TotalResultados = 0;
    }
    DistritoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ListadoDistritos = new distrito_dataservice_1.DistritoDataSource(this.Servicio);
        this.ListadoDistritos.CargarDistritos('', '', '', 0, 10);
        this.ListadoDistritos.TotalResultados.subscribe(function (res) { return _this.TotalResultados = res; });
    };
    // tslint:disable-next-line:use-life-cycle-interface
    DistritoComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.paginator.page
            .pipe(operators_1.tap(function () { return _this.CargarData(); })).subscribe();
        rxjs_1.merge(rxjs_1.fromEvent(this.FiltroDepartamento.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroProvincia.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroDistrito.nativeElement, 'keyup'))
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.paginator.pageIndex = 0;
            _this.CargarData();
        })).subscribe();
    };
    DistritoComponent.prototype.CargarData = function () {
        this.ListadoDistritos.CargarDistritos(this.FiltroDepartamento.nativeElement.value, this.FiltroProvincia.nativeElement.value, this.FiltroDistrito.nativeElement.value, this.paginator.pageIndex, this.paginator.pageSize);
    };
    DistritoComponent.prototype.Agregar = function () {
        var _this = this;
        var VentanaDistrito = this.DialogoDistritos.open(ventanaemergente_1.VentanaEmergenteDistrito, {
            width: '400px'
        });
        VentanaDistrito.afterClosed().subscribe(function (res) {
            _this.CargarData();
        });
    };
    DistritoComponent.prototype.Eliminar = function (distrito) {
        var _this = this;
        var VentanaProvincia = this.DialogoDistritos.open(ventana_confirmar_component_1.VentanaConfirmarComponent, {
            width: '400px',
            data: { objeto: 'el distrito', valor: distrito.nombre }
        });
        VentanaProvincia.afterClosed().subscribe(function (res) {
            if (res == true) {
                _this.Servicio.EliminarDistrito(distrito.id).subscribe(function (res) {
                    _this.CargarData();
                });
            }
        });
    };
    DistritoComponent.prototype.Editar = function (id) {
        var _this = this;
        this.Servicio.SeleccionarDistrito(id).subscribe(function (res) {
            var VentanaDistrito = _this.DialogoDistritos.open(ventanaemergente_1.VentanaEmergenteDistrito, {
                width: '480px',
                data: res
            });
            // tslint:disable-next-line:no-shadowed-variable
            VentanaDistrito.afterClosed().subscribe(function (res) {
                _this.CargarData();
            });
        });
    };
    __decorate([
        core_1.ViewChild('InputDepartamento'),
        __metadata("design:type", core_1.ElementRef)
    ], DistritoComponent.prototype, "FiltroDepartamento", void 0);
    __decorate([
        core_1.ViewChild('InputProvincia'),
        __metadata("design:type", core_1.ElementRef)
    ], DistritoComponent.prototype, "FiltroProvincia", void 0);
    __decorate([
        core_1.ViewChild('InputDistrito'),
        __metadata("design:type", core_1.ElementRef)
    ], DistritoComponent.prototype, "FiltroDistrito", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], DistritoComponent.prototype, "paginator", void 0);
    DistritoComponent = __decorate([
        core_1.Component({
            selector: 'app-distrito',
            templateUrl: './distrito.component.html',
            styleUrls: ['./distrito.component.css'],
            providers: [direcciones_1.ServiciosDirecciones]
        }),
        __metadata("design:paramtypes", [direcciones_1.ServiciosDirecciones,
            material_1.MatDialog])
    ], DistritoComponent);
    return DistritoComponent;
}());
exports.DistritoComponent = DistritoComponent;
//# sourceMappingURL=distrito.component.js.map