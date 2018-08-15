"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var StockDataSource = /** @class */ (function () {
    function StockDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionStock = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
        this.Totalresultados = new rxjs_1.BehaviorSubject(0);
    }
    // tslint:disable-next-line:no-shadowed-variable
    StockDataSource.prototype.connect = function (CollectionViewer) {
        return this.InformacionStock.asObservable();
    };
    StockDataSource.prototype.disconnect = function () {
        this.InformacionStock.complete();
        this.CargandoInformacion.complete();
    };
    StockDataSource.prototype.CargarStock = function (almacen, tipo, marca, modelo, producto, pagina_inicio, total_pagina, orden) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.ListarStock(almacen, tipo, marca, modelo, producto, pagina_inicio, total_pagina, orden)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) {
            _this.Totalresultados.next(res['mensaje']);
            _this.InformacionStock.next(res['data'].stock);
        });
    };
    return StockDataSource;
}());
exports.StockDataSource = StockDataSource;
//# sourceMappingURL=stock.dataservice.js.map