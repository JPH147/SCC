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
var productos_service_1 = require("../productos.service");
var VentanaEmergenteProductos = /** @class */ (function () {
    function VentanaEmergenteProductos(data, ventana, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, Servicios, ProductoServicios) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
        this.ProductoServicios = ProductoServicios;
        this.Tipos = [];
        this.Marcas = [];
        this.Modelos = [];
    }
    VentanaEmergenteProductos.prototype.onNoClick = function () {
        this.ventana.close();
    };
    // tslint:disable-next-line:use-life-cycle-interface
    VentanaEmergenteProductos.prototype.ngOnInit = function () {
        var _this = this;
        /* Crear formulario */
        this.ProductosForm = this.FormBuilder.group({
            'tipo': [null, [
                    forms_1.Validators.required
                ]],
            'marca': [{ value: null, disabled: true }, [
                    forms_1.Validators.required
                ]],
            'modelo': [{ value: null, disabled: true }, [
                    forms_1.Validators.required
                ]],
            'precio': [null, [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern('[0-9- ]+')
                ]],
            'descripcion': [null, [
                    forms_1.Validators.required
                ]],
        });
        /*Relación de productos*/
        this.Servicios.ListarTipoProductos('', '').subscribe(function (res) {
            for (var i in res) {
                _this.Tipos.push(res[i]);
            }
        });
        if (this.data) {
            // Se traen y asignan los datos
            this.ProductosForm.get('tipo').setValue(this.data.tipo);
            this.ListarMarcas(this.data.tipo);
            this.ProductosForm.get('marca').setValue(this.data.marca);
            this.ListarModelos(this.data.marca);
            this.ProductosForm.get('modelo').setValue(this.data.modelo);
            this.ProductosForm.get('descripcion').setValue(this.data.descripcion);
            this.ProductosForm.get('precio').setValue(this.data.precio);
            // Se habilitan los formularios
            this.ProductosForm.controls['marca'].enable();
            this.ProductosForm.controls['modelo'].enable();
        }
    };
    /* Se muestran marcas cuando se selecciona un tipo de producto */
    VentanaEmergenteProductos.prototype.TipoSeleccionado = function (event) {
        this.ListarMarcas(event.value);
        this.ProductosForm.get('marca').setValue('');
        this.ProductosForm.get('modelo').setValue('');
        this.ProductosForm.controls['marca'].enable();
        this.ProductosForm.controls['modelo'].disable();
    };
    /* Se muestran los modelos cuando se selecciona una marca */
    VentanaEmergenteProductos.prototype.MarcaSeleccionada = function (event) {
        this.ListarModelos(event.value);
        this.ProductosForm.get('modelo').setValue('');
        this.ProductosForm.controls['modelo'].enable();
    };
    /* Enviar al formulario */
    VentanaEmergenteProductos.prototype.Guardar = function (formulario) {
        if (this.data) {
            // tslint:disable-next-line:max-line-length
            this.ProductoServicios.Actualizar(this.data.id, formulario.value.modelo, formulario.value.descripcion, formulario.value.precio).subscribe();
        }
        if (!this.data) {
            this.ProductoServicios.Agregar(formulario.value.modelo, formulario.value.descripcion, formulario.value.precio).subscribe();
        }
        this.ProductosForm.reset();
        this.ventana.close();
    };
    VentanaEmergenteProductos.prototype.ListarMarcas = function (i) {
        var _this = this;
        this.Servicios.ListarMarca(i, '').subscribe(function (res) {
            _this.Marcas = [];
            // tslint:disable-next-line:forin
            for (var i_1 in res) {
                _this.Marcas.push(res[i_1]);
            }
        });
    };
    VentanaEmergenteProductos.prototype.ListarModelos = function (i) {
        var _this = this;
        this.Servicios.ListarModelo(i, '').subscribe(function (res) {
            _this.Modelos = [];
            // tslint:disable-next-line:forin
            for (var i_2 in res) {
                _this.Modelos.push(res[i_2]);
            }
        });
    };
    VentanaEmergenteProductos = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergente',
            templateUrl: './ventanaemergente.html',
            styleUrls: ['./ventanaemergente.css'],
            providers: [servicios_1.ServiciosGenerales, productos_service_1.ProductoService]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            servicios_1.ServiciosGenerales,
            productos_service_1.ProductoService])
    ], VentanaEmergenteProductos);
    return VentanaEmergenteProductos;
}());
exports.VentanaEmergenteProductos = VentanaEmergenteProductos;
//# sourceMappingURL=ventanaemergente.js.map