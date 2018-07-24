"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var ProductoDataSource = /** @class */ (function () {
    function ProductoDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionProductos = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
    }
    ProductoDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionProductos.asObservable();
    };
    ProductoDataSource.prototype.disconnect = function () {
        this.InformacionProductos.complete();
        this.CargandoInformacion.complete();
    };
    ProductoDataSource.prototype.CargarProductos = function (tipo, marca, modelo, descripcion
    // tslint:disable-next-line:one-line
    ) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.Listado(tipo, marca, modelo, descripcion)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) { return _this.InformacionProductos.next(res); });
    };
    return ProductoDataSource;
}());
exports.ProductoDataSource = ProductoDataSource;
//# sourceMappingURL=productos.dataservice.js.map