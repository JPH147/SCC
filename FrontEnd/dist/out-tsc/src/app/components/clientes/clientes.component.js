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
var clientes_service_1 = require("./clientes.service");
var clientes_dataservice_1 = require("./clientes.dataservice");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ClientesComponent = /** @class */ (function () {
    function ClientesComponent(Servicio, DialogoClientes) {
        this.Servicio = Servicio;
        this.DialogoClientes = DialogoClientes;
        this.Columnas = ['numero', 'codigo', 'dni', 'nombrecliente', 'apellidocliente', 'institucion', 'sede', 'subsede', 'opciones'];
    }
    ClientesComponent.prototype.ngOnInit = function () {
        this.ListadoCliente = new clientes_dataservice_1.ClienteDataSource(this.Servicio);
        this.ListadoCliente.CargarClientes('', '', '', '', '', '');
    };
    // tslint:disable-next-line:use-life-cycle-interface
    ClientesComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        rxjs_1.fromEvent(this.FiltroDni.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.CargarData();
        })).subscribe();
        rxjs_1.fromEvent(this.FiltroNombre.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.CargarData();
        })).subscribe();
        rxjs_1.fromEvent(this.FiltroApellido.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.CargarData();
        })).subscribe();
        rxjs_1.fromEvent(this.FiltroInst.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.CargarData();
        })).subscribe();
        rxjs_1.fromEvent(this.FiltroSede.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.CargarData();
        })).subscribe();
        rxjs_1.fromEvent(this.FiltroSubsede.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(200), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.CargarData();
        })).subscribe();
    };
    ClientesComponent.prototype.CargarData = function () {
        this.ListadoCliente.CargarClientes(this.FiltroInst.nativeElement.value, this.FiltroSede.nativeElement.value, this.FiltroSubsede.nativeElement.value, this.FiltroDni.nativeElement.value, this.FiltroNombre.nativeElement.value, this.FiltroApellido.nativeElement.value);
    };
    ClientesComponent.prototype.Agregar = function () {
        var _this = this;
        // tslint:disable-next-line:prefer-const
        var VentanaClientes = this.DialogoClientes.open(ventanaemergente_1.VentanaEmergenteClientes, {
            width: '800px'
        });
        VentanaClientes.afterClosed().subscribe(function (res) {
            _this.CargarData();
        });
    };
    ClientesComponent.prototype.Eliminar = function (id) {
        var _this = this;
        this.Servicio.Eliminar(id).subscribe(function (res) {
            _this.CargarData();
        });
    };
    ClientesComponent.prototype.Editar = function (id) {
        var _this = this;
        this.Servicio.Seleccionar(id).subscribe(function (res) {
            // tslint:disable-next-line:prefer-const
            var VentanaClientes = _this.DialogoClientes.open(ventanaemergente_1.VentanaEmergenteClientes, {
                width: '800px',
                data: res
            });
            // tslint:disable-next-line:no-shadowed-variable
            VentanaClientes.afterClosed().subscribe(function (res) {
                _this.CargarData();
            });
        });
    };
    __decorate([
        core_1.ViewChild('InputDNI'),
        __metadata("design:type", core_1.ElementRef)
    ], ClientesComponent.prototype, "FiltroDni", void 0);
    __decorate([
        core_1.ViewChild('InputNombreCliente'),
        __metadata("design:type", core_1.ElementRef)
    ], ClientesComponent.prototype, "FiltroNombre", void 0);
    __decorate([
        core_1.ViewChild('InputApellido'),
        __metadata("design:type", core_1.ElementRef)
    ], ClientesComponent.prototype, "FiltroApellido", void 0);
    __decorate([
        core_1.ViewChild('InputSede'),
        __metadata("design:type", core_1.ElementRef)
    ], ClientesComponent.prototype, "FiltroSede", void 0);
    __decorate([
        core_1.ViewChild('InputSubsede'),
        __metadata("design:type", core_1.ElementRef)
    ], ClientesComponent.prototype, "FiltroSubsede", void 0);
    __decorate([
        core_1.ViewChild('InputNombreInst'),
        __metadata("design:type", core_1.ElementRef)
    ], ClientesComponent.prototype, "FiltroInst", void 0);
    ClientesComponent = __decorate([
        core_1.Component({
            selector: 'app-clientes',
            templateUrl: './clientes.component.html',
            styleUrls: ['./clientes.component.css'],
            providers: [clientes_service_1.ClienteService]
        }),
        __metadata("design:paramtypes", [clientes_service_1.ClienteService,
            material_1.MatDialog])
    ], ClientesComponent);
    return ClientesComponent;
}());
exports.ClientesComponent = ClientesComponent;
//# sourceMappingURL=clientes.component.js.map