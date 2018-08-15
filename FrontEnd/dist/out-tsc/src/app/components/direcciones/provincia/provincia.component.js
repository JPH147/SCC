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
var provincia_dataservice_1 = require("./provincia.dataservice");
var operators_1 = require("rxjs/operators");
var material_1 = require("@angular/material");
var ventana_confirmar_component_1 = require("../../global/ventana-confirmar/ventana-confirmar.component");
var ventanaemergente_1 = require("./ventana-emergente/ventanaemergente");
var ProvinciaComponent = /** @class */ (function () {
    function ProvinciaComponent(Servicio, DialogoProvincias) {
        this.Servicio = Servicio;
        this.DialogoProvincias = DialogoProvincias;
        this.Columnas = ['numero', 'departamento', 'nombre', 'opciones'];
        this.TotalResultados = 0;
    }
    ProvinciaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ListadoProvincias = new provincia_dataservice_1.ProvinciaDataSource(this.Servicio);
        this.ListadoProvincias.CargarProvincias('', '', 0, 10);
        this.ListadoProvincias.TotalResultados.subscribe(function (res) { return _this.TotalResultados = res; });
    };
    // tslint:disable-next-line:use-life-cycle-interface
    ProvinciaComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.paginator.page
            .pipe(operators_1.tap(function () { return _this.CargarData(); })).subscribe();
        rxjs_1.merge(rxjs_1.fromEvent(this.FiltroDepartamento.nativeElement, 'keyup'), rxjs_1.fromEvent(this.FiltroProvincia.nativeElement, 'keyup'))
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.paginator.pageIndex = 0;
            _this.CargarData();
        })).subscribe();
    };
    ProvinciaComponent.prototype.CargarData = function () {
        this.ListadoProvincias.CargarProvincias(this.FiltroDepartamento.nativeElement.value, this.FiltroProvincia.nativeElement.value, this.paginator.pageIndex, this.paginator.pageSize);
    };
    ProvinciaComponent.prototype.Agregar = function () {
        var _this = this;
        var VentanaProvincia = this.DialogoProvincias.open(ventanaemergente_1.VentanaEmergenteProvincia, {
            width: '400px'
        });
        VentanaProvincia.afterClosed().subscribe(function (res) {
            _this.CargarData();
        });
    };
    ProvinciaComponent.prototype.Eliminar = function (provincia) {
        var _this = this;
        var VentanaProvincia = this.DialogoProvincias.open(ventana_confirmar_component_1.VentanaConfirmarComponent, {
            width: '400px',
            data: { objeto: 'la provincia', valor: provincia.nombre }
        });
        VentanaProvincia.afterClosed().subscribe(function (res) {
            if (res == true) {
                _this.Servicio.EliminarProvincia(provincia.id).subscribe(function (res) {
                    _this.CargarData();
                });
            }
        });
    };
    ProvinciaComponent.prototype.Editar = function (id) {
        var _this = this;
        this.Servicio.SeleccionarProvincia(id).subscribe(function (res) {
            var VentanaProvincia = _this.DialogoProvincias.open(ventanaemergente_1.VentanaEmergenteProvincia, {
                width: '480px',
                data: res
            });
            // tslint:disable-next-line:no-shadowed-variable
            VentanaProvincia.afterClosed().subscribe(function (res) {
                _this.CargarData();
            });
        });
    };
    __decorate([
        core_1.ViewChild('InputDepartamento'),
        __metadata("design:type", core_1.ElementRef)
    ], ProvinciaComponent.prototype, "FiltroDepartamento", void 0);
    __decorate([
        core_1.ViewChild('InputProvincia'),
        __metadata("design:type", core_1.ElementRef)
    ], ProvinciaComponent.prototype, "FiltroProvincia", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], ProvinciaComponent.prototype, "paginator", void 0);
    ProvinciaComponent = __decorate([
        core_1.Component({
            selector: 'app-provincia',
            templateUrl: './provincia.component.html',
            styleUrls: ['./provincia.component.css'],
            providers: [direcciones_1.ServiciosDirecciones]
        }),
        __metadata("design:paramtypes", [direcciones_1.ServiciosDirecciones,
            material_1.MatDialog])
    ], ProvinciaComponent);
    return ProvinciaComponent;
}());
exports.ProvinciaComponent = ProvinciaComponent;
//# sourceMappingURL=provincia.component.js.map