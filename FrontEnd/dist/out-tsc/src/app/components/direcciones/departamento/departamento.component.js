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
var rxjs_1 = require("rxjs");
var departamento_dataservice_1 = require("./departamento.dataservice");
var operators_1 = require("rxjs/operators");
var direcciones_1 = require("../../global/direcciones");
var material_1 = require("@angular/material");
var ventanaemergente_1 = require("./ventana-emergente/ventanaemergente");
var ventana_confirmar_component_1 = require("../../global/ventana-confirmar/ventana-confirmar.component");
var DepartamentoComponent = /** @class */ (function () {
    function DepartamentoComponent(Servicio, DialogoDepartamentos) {
        this.Servicio = Servicio;
        this.DialogoDepartamentos = DialogoDepartamentos;
        this.Columnas = ['numero', 'nombre', 'opciones'];
        this.TotalResultados = 0;
    }
    DepartamentoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ListadoDepartamentos = new departamento_dataservice_1.DepartamentoDataSource(this.Servicio);
        this.ListadoDepartamentos.CargarDepartamentos('', 0, 10);
        this.ListadoDepartamentos.TotalResultados.subscribe(function (res) { return _this.TotalResultados = res; });
    };
    // tslint:disable-next-line:use-life-cycle-interface
    DepartamentoComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.paginator.page
            .pipe(operators_1.tap(function () { return _this.CargarData(); })).subscribe();
        rxjs_1.fromEvent(this.FiltroDepartamento.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.paginator.pageIndex = 0;
            _this.CargarData();
        })).subscribe();
    };
    DepartamentoComponent.prototype.CargarData = function () {
        this.ListadoDepartamentos.CargarDepartamentos(this.FiltroDepartamento.nativeElement.value, this.paginator.pageIndex, this.paginator.pageSize);
    };
    DepartamentoComponent.prototype.Agregar = function () {
        var _this = this;
        var VentanaDepartamento = this.DialogoDepartamentos.open(ventanaemergente_1.VentanaEmergenteDepartamento, {
            width: '400px'
        });
        VentanaDepartamento.afterClosed().subscribe(function (res) {
            _this.CargarData();
        });
    };
    DepartamentoComponent.prototype.Eliminar = function (departamento) {
        var _this = this;
        var VentanaDepartamento = this.DialogoDepartamentos.open(ventana_confirmar_component_1.VentanaConfirmarComponent, {
            width: '400px',
            data: { objeto: 'el departamento', valor: departamento.descripcion }
        });
        VentanaDepartamento.afterClosed().subscribe(function (res) {
            if (res == true) {
                _this.Servicio.EliminarDepartamento(departamento.id).subscribe(function (res) {
                    _this.CargarData();
                });
            }
        });
    };
    DepartamentoComponent.prototype.Editar = function (id) {
        var _this = this;
        this.Servicio.SeleccionarDepartamento(id).subscribe(function (res) {
            var VentanaDepartamento = _this.DialogoDepartamentos.open(ventanaemergente_1.VentanaEmergenteDepartamento, {
                width: '480px',
                data: res
            });
            // tslint:disable-next-line:no-shadowed-variable
            VentanaDepartamento.afterClosed().subscribe(function (res) {
                _this.CargarData();
            });
        });
    };
    __decorate([
        core_1.ViewChild('InputDepartamento'),
        __metadata("design:type", core_1.ElementRef)
    ], DepartamentoComponent.prototype, "FiltroDepartamento", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], DepartamentoComponent.prototype, "paginator", void 0);
    DepartamentoComponent = __decorate([
        core_1.Component({
            selector: 'app-departamento',
            templateUrl: './departamento.component.html',
            styleUrls: ['./departamento.component.css'],
            providers: [direcciones_1.ServiciosDirecciones]
        }),
        __metadata("design:paramtypes", [direcciones_1.ServiciosDirecciones,
            material_1.MatDialog])
    ], DepartamentoComponent);
    return DepartamentoComponent;
}());
exports.DepartamentoComponent = DepartamentoComponent;
//# sourceMappingURL=departamento.component.js.map