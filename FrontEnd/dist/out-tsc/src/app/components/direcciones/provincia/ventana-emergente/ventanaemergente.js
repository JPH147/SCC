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
var VentanaEmergenteProvincia = /** @class */ (function () {
    function VentanaEmergenteProvincia(data, ventana, FormBuilder, Servicio, snackBar) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicio = Servicio;
        this.snackBar = snackBar;
        this.departamentos = [];
    }
    VentanaEmergenteProvincia.prototype.onNoClick = function () {
        this.ventana.close();
    };
    VentanaEmergenteProvincia.prototype.ngOnInit = function () {
        var _this = this;
        this.ProvinciasForm = this.FormBuilder.group({
            'departamento': [null, [
                    forms_1.Validators.required
                ]],
            'nombre': [null, [
                    forms_1.Validators.required
                ]]
        });
        this.Servicio.ListarDepartamentos("", 0, 100000).subscribe(function (res) {
            var Departamento = res['data'].departamentos;
            for (var i in Departamento) {
                _this.departamentos.push(Departamento[i]);
            }
        });
        if (this.data) {
            console.log(this.data);
            this.ProvinciasForm.get('departamento').setValue(this.data.departamento);
            this.ProvinciasForm.get('nombre').setValue(this.data.nombre);
        }
    };
    VentanaEmergenteProvincia.prototype.Guardar = function (formulario) {
        if (this.data) {
            this.mensaje = 'Datos actualizados satisfactoriamente';
            this.Servicio.ActualizarDepartamento(this.data.id, formulario.value.nombre).subscribe();
        }
        if (!this.data) {
            this.mensaje = 'Provincia creada satisfactoriamente';
            this.Servicio.CrearProvincia(formulario.value.departamento, formulario.value.nombre).subscribe();
        }
        this.ventana.close();
    };
    VentanaEmergenteProvincia.prototype.Notificacion = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    };
    VentanaEmergenteProvincia = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergente',
            templateUrl: './ventanaemergente.html',
            styleUrls: ['./ventanaemergente.css'],
            providers: [direcciones_1.ServiciosDirecciones]
        }),
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            direcciones_1.ServiciosDirecciones,
            material_1.MatSnackBar])
    ], VentanaEmergenteProvincia);
    return VentanaEmergenteProvincia;
}());
exports.VentanaEmergenteProvincia = VentanaEmergenteProvincia;
//# sourceMappingURL=ventanaemergente.js.map