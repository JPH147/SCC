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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ELEMENT_DATA = [
    { position: 1, pecosa: '00059681', fecha: '08/02/2018', destino: 'Ica', sucursal: 'Lima' },
    { position: 2, pecosa: '00059682', fecha: '15/02/2018', destino: 'Chimbote', sucursal: 'Arequipa' },
    { position: 3, pecosa: '00059683', fecha: '21/02/2018', destino: 'La Merced', sucursal: 'Cuzco' },
    { position: 4, pecosa: '00059684', fecha: '27/02/2018', destino: 'Apurimac', sucursal: 'Piura' },
    { position: 5, pecosa: '00059685', fecha: '10/03/2018', destino: 'Abancay', sucursal: 'Trujillo' },
    { position: 6, pecosa: '00059686', fecha: '12/03/2018', destino: 'Ayacucho', sucursal: 'Chiclayo' },
    { position: 7, pecosa: '00059687', fecha: '20/03/2018', destino: 'Cajamarca', sucursal: 'Puno' },
    { position: 8, pecosa: '00059688', fecha: '25/03/2018', destino: 'Huancavelica', sucursal: 'Tumbes' },
    { position: 9, pecosa: '00059689', fecha: '02/04/2018', destino: 'Iquitos', sucursal: 'Callao' },
    { position: 10, pecosa: '00059690', fecha: '09/04/2018', destino: 'PucallPa', sucursal: 'Tacna' },
];
var ListadoSalidaVendedoresComponent = /** @class */ (function () {
    function ListadoSalidaVendedoresComponent() {
        this.displayedColumns = ['position', 'pecosa', 'sucursal', 'fecha', 'destino', 'opciones'];
        this.dataSource = ELEMENT_DATA;
    }
    ListadoSalidaVendedoresComponent.prototype.ngOnInit = function () {
    };
    ListadoSalidaVendedoresComponent = __decorate([
        core_1.Component({
            selector: 'app-listado-salida-vendedores',
            templateUrl: './listado-salida-vendedores.component.html',
            styleUrls: ['./listado-salida-vendedores.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], ListadoSalidaVendedoresComponent);
    return ListadoSalidaVendedoresComponent;
}());
exports.ListadoSalidaVendedoresComponent = ListadoSalidaVendedoresComponent;
//# sourceMappingURL=listado-salida-vendedores.component.js.map