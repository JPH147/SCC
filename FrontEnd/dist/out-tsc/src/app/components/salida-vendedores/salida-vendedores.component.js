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
var ventanaseriessv_1 = require("./ventana-seriessv/ventanaseriessv");
var ventanaretorno_1 = require("./ventana-retorno/ventanaretorno");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var SalidaVendedoresComponent = /** @class */ (function () {
    function SalidaVendedoresComponent(dialog, DialogoSerie, Dialogotalon) {
        this.dialog = dialog;
        this.DialogoSerie = DialogoSerie;
        this.Dialogotalon = Dialogotalon;
        this.date = new forms_1.FormControl(new Date());
        this.serializedDate = new forms_1.FormControl((new Date()).toISOString());
        this.toppings = new forms_1.FormControl();
        this.toppingList = ['Jean Pierre', 'Joel Vicuña', 'Carlos Rodriguez', 'Jean Paul', 'Ivan Arones', 'Fernando Martinez'];
        this.contador = 1;
        this.serietalonarios = [{ numero: this.contador, serie: '', inicio: '', fin: '' }];
    }
    SalidaVendedoresComponent.prototype.ngOnInit = function () {
        this.contador = 1;
        this.articulos = [
            { numero: this.contador, nombre: '', cantidad: null, precio: null }
        ];
    };
    SalidaVendedoresComponent.prototype.agregar = function () {
        this.contador++;
        this.articulos.push({ numero: this.contador, nombre: '', cantidad: null, precio: null });
    };
    SalidaVendedoresComponent.prototype.Aceptar = function () {
        console.log(this.articulos);
    };
    SalidaVendedoresComponent.prototype.AgregarSerieSalidaV = function () {
        var serieventana = this.DialogoSerie.open(ventanaseriessv_1.ventanaseriessv, {
            width: '800px'
        });
    };
    SalidaVendedoresComponent.prototype.Agregatalonario = function () {
        var serietalorarios = this.Dialogotalon.open(ventanaretorno_1.ventanaRetorno, {
            width: '600px'
        });
    };
    SalidaVendedoresComponent.prototype.openDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(DialogoComponent, {
            width: '250px',
            data: { name: this.name, animal: this.animal }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            console.log('The dialog was closed');
            _this.animal = result;
        });
    };
    SalidaVendedoresComponent = __decorate([
        core_1.Component({
            selector: 'app-salida-vendedores',
            templateUrl: './salida-vendedores.component.html',
            styleUrls: ['./salida-vendedores.component.css'],
        }),
        __metadata("design:paramtypes", [material_1.MatDialog,
            material_1.MatDialog,
            material_1.MatDialog])
    ], SalidaVendedoresComponent);
    return SalidaVendedoresComponent;
}());
exports.SalidaVendedoresComponent = SalidaVendedoresComponent;
var DialogoComponent = /** @class */ (function () {
    function DialogoComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    DialogoComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    DialogoComponent = __decorate([
        core_1.Component({
            selector: 'app-dialogo',
            templateUrl: './dialogo.html',
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object])
    ], DialogoComponent);
    return DialogoComponent;
}());
exports.DialogoComponent = DialogoComponent;
//# sourceMappingURL=salida-vendedores.component.js.map