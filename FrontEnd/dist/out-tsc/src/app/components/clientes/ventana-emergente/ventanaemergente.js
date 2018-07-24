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
var clientes_service_1 = require("../clientes.service");
var VentanaEmergenteClientes = /** @class */ (function () {
    function VentanaEmergenteClientes(data, ventana, FormBuilder, Servicios, ClienteServicios) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
        this.ClienteServicios = ClienteServicios;
        this.Institucion = [];
    }
    VentanaEmergenteClientes.prototype.onNoClick = function () {
        this.ventana.close();
    };
    VentanaEmergenteClientes.prototype.ngOnInit = function () {
        var _this = this;
        /* Crear formulario */
        this.ClientesForm = this.FormBuilder.group({
            'institucion': [null, [
                    forms_1.Validators.required
                ]],
            'codigo': [null, [
                    forms_1.Validators.required
                ]],
            'dni': [null, [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern("[0-9- ]+")
                ]],
            'nombre': [null, [
                    forms_1.Validators.required
                ]],
            'apellido': [null, [
                    forms_1.Validators.required
                ]],
            'cip': [null, [
                    forms_1.Validators.required
                ]],
            'email': [null, [
                    forms_1.Validators.required
                ]],
            'casilla': [null, [
                    forms_1.Validators.required
                ]],
            'trabajo': [null, [
                    forms_1.Validators.required
                ]],
            'cargo': [null, [
                    forms_1.Validators.required
                ]],
            'calificacioncrediticia': [null, [
                    forms_1.Validators.required
                ]],
            'calificacionpersonal': [null, [
                    forms_1.Validators.required
                ]],
            'aporte': [null, [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern("[0-9- ]+")
                ]],
            'fecharegistro': [null, [
                    forms_1.Validators.required
                ]],
        });
        /*Relación de productos*/
        this.Servicios.ListarInstitucion().subscribe(function (res) {
            for (var i in res) {
                _this.Institucion.push(res[i]);
            }
        });
        if (this.data) {
            // Se traen y asignan los datos
            this.ClientesForm.get('institucion').setValue(this.data.institucion);
            this.ListarInstitucion();
            this.ClientesForm.get('codigo').setValue(this.data.codigo);
            this.ClientesForm.get('dni').setValue(this.data.dni);
            this.ClientesForm.get('nombre').setValue(this.data.nombre);
            this.ClientesForm.get('apellido').setValue(this.data.apellido);
            this.ClientesForm.get('cip').setValue(this.data.cip);
            this.ClientesForm.get('email').setValue(this.data.email);
            this.ClientesForm.get('casilla').setValue(this.data.casilla);
            this.ClientesForm.get('trabajo').setValue(this.data.trabajo);
            this.ClientesForm.get('cargo').setValue(this.data.cargo);
            this.ClientesForm.get('calificacioncrediticia').setValue(this.data.calificacioncrediticia);
            this.ClientesForm.get('calificacionpersonal').setValue(this.data.calificacionpersonal);
            this.ClientesForm.get('aporte').setValue(this.data.aporte);
            this.ClientesForm.get('fecharegistro').setValue(this.data.fecharegistro);
            this.ClientesForm.controls['institucion'].enable();
        }
    };
    /* Enviar al formulario */
    VentanaEmergenteClientes.prototype.Guardar = function (formulario) {
        /*if(this.data){
          this.ClienteService.Actualizar(this.data.id,formulario.value.modelo, formulario.value.descripcion, formulario.value.precio).subscribe(res=>console.log(res))
        }*/
        if (!this.data) {
            this.ClienteServicios.Agregar(formulario.value.institucion, formulario.value.codigo, formulario.value.dni, formulario.value.nombre, formulario.value.apellido, formulario.value.cip, formulario.value.email, formulario.value.casilla, formulario.value.trabajo, formulario.value.cargo, formulario.value.calificacioncrediticia, formulario.value.calificacionpersonal, formulario.value.aporte).subscribe(function (res) { return console.log(res); });
        }
        this.ClientesForm.reset();
        this.ventana.close();
    };
    VentanaEmergenteClientes.prototype.ListarInstitucion = function () {
        var _this = this;
        this.Servicios.ListarInstitucion().subscribe(function (res) {
            _this.Institucion = [];
            for (var i in res) {
                _this.Institucion.push(res[i]);
            }
        });
    };
    VentanaEmergenteClientes = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergente',
            templateUrl: './ventanaemergente.html',
            styleUrls: ['./ventanaemergente.css'],
            providers: [servicios_1.ServiciosGenerales, clientes_service_1.ClienteService]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            servicios_1.ServiciosGenerales,
            clientes_service_1.ClienteService])
    ], VentanaEmergenteClientes);
    return VentanaEmergenteClientes;
}());
exports.VentanaEmergenteClientes = VentanaEmergenteClientes;
//# sourceMappingURL=ventanaemergente.js.map