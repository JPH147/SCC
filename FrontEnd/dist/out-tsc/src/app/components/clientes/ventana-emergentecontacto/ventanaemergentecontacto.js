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
var telefonos_1 = require("../../global/telefonos");
var VentanaEmergenteContacto = /** @class */ (function () {
    function VentanaEmergenteContacto(data, ventana, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, ServicioTelefono) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.ServicioTelefono = ServicioTelefono;
        this.items = [];
        this.contador = 1;
        this.items = [{ telefono: '', tipo: 1, relevancia: 1, observacion: '' }];
    }
    VentanaEmergenteContacto.prototype.onNoClick = function () {
        this.ventana.close();
    };
    VentanaEmergenteContacto.prototype.add = function () {
        this.items.push(this.createItem());
        console.log(this.items);
    };
    // tslint:disable-next-line:use-life-cycle-interface
    VentanaEmergenteContacto.prototype.ngOnInit = function () {
        this.TelefonosForm = this.FormBuilder.group({
            'telefono': [null, [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern('[0-9- ]+')
                ]],
            'tipo': [null, [
                    forms_1.Validators.required
                ]],
            'relevancia': [null, [
                    forms_1.Validators.required
                ]],
            'observacion': [null, [
                    forms_1.Validators.required
                ]],
            items: this.FormBuilder.array([this.createItem()])
        });
        this.ListarTipos();
        this.ListarRelevancia();
    };
    VentanaEmergenteContacto.prototype.createItem = function () {
        return this.FormBuilder.group({
            telefono: '',
            tipo: 2,
            relevancia: 1,
            observacion: ''
        });
    };
    /* addItem(): void {
       //this.items = this.TelefonosForm.get('items') as FormArray;
       this.items.push(this.createItem());
     }*/
    VentanaEmergenteContacto.prototype.ListarTipos = function () {
        this.Tipos = [
            { id: 1, viewValue: 'Celular' },
            { id: 2, viewValue: 'Casa' },
            { id: 3, viewValue: 'Trabajo' },
            { id: 4, viewValue: 'Otro' }
        ];
    };
    VentanaEmergenteContacto.prototype.ListarRelevancia = function () {
        this.Relevancias = [
            { id: 1, viewValue: 'Principal' },
            { id: 2, viewValue: 'Secundario' },
            { id: 0, viewValue: 'Inactivo' },
        ];
    };
    VentanaEmergenteContacto.prototype.Guardar = function (formulario) {
        if (this.data !== 0) {
            console.log(this.data);
            this.ServicioTelefono.CrearTelefono(this.data, formulario.value.telefono, formulario.value.observacion, formulario.value.tipo, formulario.value.relevancia).subscribe(function (res) { return console.log(res); });
        }
        this.ventana.close();
    };
    VentanaEmergenteContacto = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergentecontacto',
            templateUrl: './ventanaemergentecontacto.html',
            styleUrls: ['./ventanaemergentecontacto.css'],
            providers: [telefonos_1.ServiciosTelefonos]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            telefonos_1.ServiciosTelefonos])
    ], VentanaEmergenteContacto);
    return VentanaEmergenteContacto;
}());
exports.VentanaEmergenteContacto = VentanaEmergenteContacto;
//# sourceMappingURL=ventanaemergentecontacto.js.map