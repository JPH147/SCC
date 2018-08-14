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
var ventas_service_1 = require("../ventas.service");
var VentanaEmergenteArchivos = /** @class */ (function () {
    function VentanaEmergenteArchivos(data, ventana, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, Servicios, VentaServicios, _formBuilder) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
        this.VentaServicios = VentaServicios;
        this._formBuilder = _formBuilder;
        this.Tipos = [];
        this.Marcas = [];
        this.Modelos = [];
        this.isLinear = false;
    }
    VentanaEmergenteArchivos.prototype.ngOnInit = function () {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', forms_1.Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', forms_1.Validators.required]
        });
        this.thirdFormGroup = this._formBuilder.group({
            thirdCtrl: ['', forms_1.Validators.required]
        });
        this.fourthFormGroup = this._formBuilder.group({
            fourthCtrl: ['', forms_1.Validators.required]
        });
        this.fifthFormGroup = this._formBuilder.group({
            fifthCtrl: ['', forms_1.Validators.required]
        });
        this.sixthFormGroup = this._formBuilder.group({
            sixthCtrl: ['', forms_1.Validators.required]
        });
        this.seventhFormGroup = this._formBuilder.group({
            seventhCtrl: ['', forms_1.Validators.required]
        });
    };
    VentanaEmergenteArchivos = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergente',
            templateUrl: './ventanaemergente.html',
            styleUrls: ['./ventanaemergente.css'],
            providers: [servicios_1.ServiciosGenerales, ventas_service_1.VentaService]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            servicios_1.ServiciosGenerales,
            ventas_service_1.VentaService,
            forms_1.FormBuilder])
    ], VentanaEmergenteArchivos);
    return VentanaEmergenteArchivos;
}());
exports.VentanaEmergenteArchivos = VentanaEmergenteArchivos;
//# sourceMappingURL=ventanaemergente.js.map