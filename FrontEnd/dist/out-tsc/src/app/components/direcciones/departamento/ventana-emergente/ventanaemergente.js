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
var direcciones_1 = require("../../../global/direcciones");
var VentanaEmergenteDepartamento = /** @class */ (function () {
    function VentanaEmergenteDepartamento(data, ventana, FormBuilder, Servicios, snackBar) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
        this.snackBar = snackBar;
    }
    VentanaEmergenteDepartamento.prototype.onNoClick = function () {
        this.ventana.close();
    };
    VentanaEmergenteDepartamento.prototype.ngOnInit = function () {
        this.DepartamentosForm = this.FormBuilder.group({
            'nombre': [null, [
                    forms_1.Validators.required
                ]]
        });
        if (this.data) {
            this.DepartamentosForm.get('nombre').setValue(this.data.nombre);
        }
    };
    VentanaEmergenteDepartamento.prototype.Guardar = function (formulario) {
        if (this.data) {
            this.mensaje = 'Datos actualizados satisfactoriamente';
            this.Servicios.ActualizarDepartamento(this.data.id, formulario.value.nombre).subscribe();
        }
        if (!this.data) {
            this.mensaje = 'Departamento creado satisfactoriamente';
            this.Servicios.CrearDepartamento(formulario.value.nombre).subscribe();
        }
        this.DepartamentosForm.reset();
        this.ventana.close();
    };
    VentanaEmergenteDepartamento.prototype.Notificacion = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    };
    VentanaEmergenteDepartamento = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergentedepartamento',
            templateUrl: './ventanaemergente.html',
            styleUrls: ['./ventanaemergente.css'],
            providers: [direcciones_1.ServiciosDirecciones]
        }),
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            direcciones_1.ServiciosDirecciones,
            material_1.MatSnackBar])
    ], VentanaEmergenteDepartamento);
    return VentanaEmergenteDepartamento;
}());
exports.VentanaEmergenteDepartamento = VentanaEmergenteDepartamento;
//# sourceMappingURL=ventanaemergente.js.map