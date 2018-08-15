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
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var url_1 = require("./url");
var ServiciosGenerales = /** @class */ (function () {
    function ServiciosGenerales(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ServiciosGenerales.prototype.ngOnInit = function () { };
    // F=moment(fecha).format('YYYY/MM/DD');
    ServiciosGenerales.prototype.ListarTipoProductos = function (nombre, unidad_medida) {
        return this.http.get(this.url + 'productotipo/read.php?prnombre=' + nombre + '&prum' + unidad_medida)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].tipo_productos;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarMarca = function (id_tipo, nombre) {
        return this.http.get(this.url + 'productomarca/read.php?prtipo=' + id_tipo + '&prmarca' + nombre)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].marca;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarModelo = function (id_marca, nombre) {
        return this.http.get(this.url + 'productomodelo/read.php?prmarca=' + id_marca + '&prnombre' + nombre)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].modelo;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarInstitucion = function () {
        return this.http.get(this.url + 'institucion/read.php')
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].institucion;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarSede = function (id_institucion, sd_nombre) {
        return this.http.get(this.url + 'sede/read.php?id_institucion=' + id_institucion + '&sd_nombre' + sd_nombre)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].sede;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarSubsede = function (id_sede, ssd_nombre) {
        return this.http.get(this.url + 'subsede/read.php?id_sede=' + id_sede + '&ssd_nombre' + ssd_nombre)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].subsede;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarAlmacen = function () {
        return this.http.get(this.url + 'almacen/read.php')
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].almacenes;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarTransaccionTipo = function () {
        return this.http.get(this.url + 'transacciontipo/read.php', {
            params: new http_1.HttpParams()
                .set('prid', '1')
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].tipos;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarProveedor = function (nombre) {
        return this.http.get(this.url + 'proveedor/read.php', {
            params: new http_1.HttpParams()
                .set('prnombre', nombre)
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].proveedor;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales.prototype.ListarSucursal = function (id, nombre) {
        var ID;
        if (id == null) {
            ID = "";
        }
        else {
            ID = id.toString();
        }
        return this.http.get(this.url + 'sucursal/read.php', {
            params: new http_1.HttpParams()
                .set('prid', ID)
                .set('prnombre', nombre)
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].sucursal;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosGenerales = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ServiciosGenerales);
    return ServiciosGenerales;
}());
exports.ServiciosGenerales = ServiciosGenerales;
//# sourceMappingURL=servicios.js.map