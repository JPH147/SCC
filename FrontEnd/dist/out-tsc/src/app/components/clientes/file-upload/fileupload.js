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
var FileUpload = /** @class */ (function () {
    function FileUpload(data, ventana, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, Servicios, ClienteServicios) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
        this.ClienteServicios = ClienteServicios;
    }
    FileUpload.prototype.ngOnInit = function () {
    };
    FileUpload.prototype.onNoClick = function () {
        this.ventana.close();
    };
    FileUpload = __decorate([
        core_1.Component({
            selector: 'app-fileupload',
            templateUrl: './fileupload.html',
            styleUrls: ['./fileupload.css'],
            providers: [servicios_1.ServiciosGenerales, clientes_service_1.ClienteService]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            servicios_1.ServiciosGenerales,
            clientes_service_1.ClienteService])
    ], FileUpload);
    return FileUpload;
}());
exports.FileUpload = FileUpload;
//# sourceMappingURL=fileupload.js.map