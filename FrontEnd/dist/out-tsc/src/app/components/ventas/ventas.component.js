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
    { numero: 1, month: 'Agosto', price: '255.00' },
    { numero: 2, month: 'Setiembre', price: '255.00' }
];
var VentasComponent = /** @class */ (function () {
    function VentasComponent(
    //private Servicio: VentaService
    ) {
        this.states = [
            'Factura', 'Boleta'
        ];
        this.displayedColumns = ['numero', 'month', 'price'];
        this.dataSource = ELEMENT_DATA;
    }
    VentasComponent.prototype.ngOnInit = function () {
        //this.ListadoCronograma = new VentaDataSource(this.Servicio);
        //this.ListadoCronograma.GenerarCronograma(new Date('2018-07-19'), 100, 10);
    };
    VentasComponent = __decorate([
        core_1.Component({
            selector: 'app-ventas',
            templateUrl: './ventas.component.html',
            styleUrls: ['./ventas.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], VentasComponent);
    return VentasComponent;
}());
exports.VentasComponent = VentasComponent;
//# sourceMappingURL=ventas.component.js.map