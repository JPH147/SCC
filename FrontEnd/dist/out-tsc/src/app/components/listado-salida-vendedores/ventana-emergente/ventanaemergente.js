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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var servicios_1 = require("../../global/servicios");
var VentanaEmergenteGastos = /** @class */ (function () {
    function VentanaEmergenteGastos(data, ventana, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, Servicios) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
    }
    VentanaEmergenteGastos.prototype.onNoClick = function () {
        this.ventana.close();
    };
    // tslint:disable-next-line:use-life-cycle-interface
    VentanaEmergenteGastos.prototype.ngOnInit = function () { };
    VentanaEmergenteGastos = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergente',
            templateUrl: './ventanaemergente.html',
            styleUrls: ['./ventanaemergente.css'],
            providers: [servicios_1.ServiciosGenerales]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            servicios_1.ServiciosGenerales])
    ], VentanaEmergenteGastos);
    return VentanaEmergenteGastos;
}());
exports.VentanaEmergenteGastos = VentanaEmergenteGastos;
//# sourceMappingURL=ventanaemergente.js.map