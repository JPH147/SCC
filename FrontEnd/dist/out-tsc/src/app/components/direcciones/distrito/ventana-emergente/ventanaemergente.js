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
var VentanaEmergenteDistrito = /** @class */ (function () {
    function VentanaEmergenteDistrito(data, ventana, FormBuilder, Servicio, snackBar) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicio = Servicio;
        this.snackBar = snackBar;
        this.departamentos = [];
        this.provincias = [];
    }
    VentanaEmergenteDistrito.prototype.onNoClick = function () {
        this.ventana.close();
    };
    VentanaEmergenteDistrito.prototype.ngOnInit = function () {
        var _this = this;
        this.DistritosForm = this.FormBuilder.group({
            'departamento': [null, [
                    forms_1.Validators.required
                ]],
            'provincia': [{ value: null, disabled: true }, [
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
            // Se traen y asignan los datos
            this.DistritosForm.get('departamento').setValue(this.data.departamento);
            this.ListarProvincias(this.data.departamento);
            this.DistritosForm.get('provincia').setValue(this.data.provincia);
            this.DistritosForm.get('nombre').setValue(this.data.nombre);
            // Se habilitan los formularios
            this.DistritosForm.controls['provincia'].enable();
        }
    };
    VentanaEmergenteDistrito.prototype.Guardar = function (formulario) {
        if (this.data) {
            this.mensaje = 'Distrito actualizado satisfactoriamente';
            this.Servicio.ActualizarDistrito(this.data.id, formulario.value.provincia, formulario.value.nombre).subscribe();
        }
        if (!this.data) {
            this.mensaje = 'Distrito creado satisfactoriamente';
            this.Servicio.CrearDistrito(formulario.value.provincia, formulario.value.nombre).subscribe();
        }
        this.DistritosForm.reset();
        this.ventana.close();
    };
    VentanaEmergenteDistrito.prototype.Notificacion = function (message, action) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    };
    VentanaEmergenteDistrito.prototype.DepartamentoSeleccionado = function (event) {
        this.ListarProvincias(event.value);
        this.DistritosForm.get('provincia').setValue("");
        this.DistritosForm.controls['provincia'].enable();
    };
    VentanaEmergenteDistrito.prototype.ListarProvincias = function (nombre_departamento) {
        var _this = this;
        this.provincias = [];
        this.Servicio.ListarProvincias(nombre_departamento, "", 0, 100000).subscribe(function (res) {
            var Provincia = res['data'].provincias;
            for (var i in Provincia) {
                _this.provincias.push(Provincia[i]);
            }
        });
    };
    VentanaEmergenteDistrito = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergentedistrito',
            templateUrl: './ventanaemergente.html',
            styleUrls: ['./ventanaemergente.css'],
            providers: [direcciones_1.ServiciosDirecciones]
        }),
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            direcciones_1.ServiciosDirecciones,
            material_1.MatSnackBar])
    ], VentanaEmergenteDistrito);
    return VentanaEmergenteDistrito;
}());
exports.VentanaEmergenteDistrito = VentanaEmergenteDistrito;
//# sourceMappingURL=ventanaemergente.js.map