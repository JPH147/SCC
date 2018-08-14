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
var VentanaConfirmarComponent = /** @class */ (function () {
    function VentanaConfirmarComponent(data, ventana, snackBar) {
        this.data = data;
        this.ventana = ventana;
        this.snackBar = snackBar;
    }
    VentanaConfirmarComponent.prototype.ngOnInit = function () {
        this.mensaje = this.data.objeto + ' ' + 'se eliminó satisfactoriamente';
    };
    VentanaConfirmarComponent.prototype.onNoClick = function () {
        this.ventana.close();
    };
    VentanaConfirmarComponent.prototype.Aceptar = function () {
        return true;
    };
    VentanaConfirmarComponent.prototype.Notificacion = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    };
    VentanaConfirmarComponent = __decorate([
        core_1.Component({
            selector: 'app-ventana-confirmar',
            templateUrl: './ventana-confirmar.component.html',
            styleUrls: ['./ventana-confirmar.component.css'],
        }),
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            material_1.MatSnackBar])
    ], VentanaConfirmarComponent);
    return VentanaConfirmarComponent;
}());
exports.VentanaConfirmarComponent = VentanaConfirmarComponent;
//# sourceMappingURL=ventana-confirmar.component.js.map