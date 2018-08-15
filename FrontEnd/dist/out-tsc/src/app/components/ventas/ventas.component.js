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
var ventanaemergente_1 = require("./ventana-emergente/ventanaemergente");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ventas_service_1 = require("./ventas.service");
var ventas_dataservice_1 = require("./ventas.dataservice");
var material_1 = require("@angular/material");
var tipodocumento_1 = require("../global/tipodocumento");
var tipopago_1 = require("../global/tipopago");
var clientes_service_1 = require("../clientes/clientes.service");
var clientes_dataservice_1 = require("../clientes/clientes.dataservice");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ELEMENT_DATA = [
    { numero: 1, month: 'Agosto', price: '255.00' },
    { numero: 2, month: 'Setiembre', price: '255.00' }
];
var VentasComponent = /** @class */ (function () {
    function VentasComponent(
    /*@Inject(MAT_DIALOG_DATA) public data,*/
    Servicio, ClienteServicio, DialogoArchivos, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, ServicioTipoDocumento, ServicioTipoPago) {
        this.Servicio = Servicio;
        this.ClienteServicio = ClienteServicio;
        this.DialogoArchivos = DialogoArchivos;
        this.FormBuilder = FormBuilder;
        this.ServicioTipoDocumento = ServicioTipoDocumento;
        this.ServicioTipoPago = ServicioTipoPago;
        this.LstTipoDocumento = [];
        this.LstCliente = [];
        this.LstTipoPago = [];
        this.typesdoc = [
            'Factura', 'Boleta'
        ];
        this.states = [
            'Activo', 'Finalizado', 'Canjeado', 'Anulado'
        ];
        this.displayedColumns = ['numero', 'month', 'price'];
        this.dataSource = ELEMENT_DATA;
        this.contador = 1;
        this.productos = [{ producto: '', imei: '' }];
        this.ListarTipoDocumento();
        this.ListarTipoPago();
        //this.ListarClientes('', '', '', '' , '', '');
    }
    VentasComponent.prototype.ngOnInit = function () {
        this.ListadoCronograma = new ventas_dataservice_1.VentaDataSource(this.Servicio);
        this.ListadoCliente = new clientes_dataservice_1.ClienteDataSource(this.ClienteServicio);
        this.ListarClientes('', '', '', '', this.ClienteAutoComplete.nativeElement.value, '');
        this.ListadoCronograma.GenerarCronograma('', '', 0);
        this.VentasForm = this.FormBuilder.group({
            'talonario': [null, [
                    forms_1.Validators.required
                ]],
            'contrato': [null, [
                    forms_1.Validators.required
                ]],
            'tipodoc': [null, [
                    forms_1.Validators.required
                ]],
            'estado': [null, [
                    forms_1.Validators.required
                ]],
            'cliente': [null, [
                    forms_1.Validators.required
                ]],
            'cargo': [null, [
                    forms_1.Validators.required
                ]],
            'trabajo': [null, [
                    forms_1.Validators.required
                ]],
            'domicilio': [null, [
                    forms_1.Validators.required
                ]],
            'lugar': [null, [
                    forms_1.Validators.required
                ]],
            'telefono': [null, [
                    forms_1.Validators.required
                ]],
            'vendedor': [null, [
                    forms_1.Validators.required
                ]],
            'fechaventa': [null, [
                    forms_1.Validators.required
                ]],
            'fechapago': [null, [
                    forms_1.Validators.required
                ]],
            'tipopago': [null, [
                    forms_1.Validators.required
                ]],
            'montototal': [null, [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern('[0-9- ]+')
                ]],
            'cuotas': [null, [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern('[0-9- ]+')
                ]],
            'observaciones': [null, [
                    forms_1.Validators.required
                ]],
        });
    };
    //tslint:disable-next-line:use-life-cycle-interface
    VentasComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        rxjs_1.fromEvent(this.ClienteAutoComplete.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(10), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.ListarClientes('', '', '', '', _this.VentasForm.value.cliente, '');
        })).subscribe();
    };
    /* Agregar productos */
    VentasComponent.prototype.Agregar = function () {
        // tslint:disable-next-line:prefer-const
        var VentanaAdjuntos = this.DialogoArchivos.open(ventanaemergente_1.VentanaEmergenteArchivos, {
            width: '800px'
        });
    };
    /*Cronograma */
    VentasComponent.prototype.GeneraCronograma = function () {
        this.ListadoCronograma.GenerarCronograma(this.VentasForm.value.fechapago.toISOString(), this.FiltroMonto.nativeElement.value, this.FiltroCuota.nativeElement.value);
    };
    /*VentanaAdjuntos.afterClosed().subscribe(res => {
      this.CargarData();
    });*/
    VentasComponent.prototype.AgregaProductos = function () {
        this.contador++;
        this.productos.push({ producto: '', imei: '' });
    };
    VentasComponent.prototype.EliminarProductos = function () {
        this.contador--;
        this.productos.splice(1);
    };
    VentasComponent.prototype.ListarTipoPago = function () {
        var _this = this;
        this.ServicioTipoPago.ListarTipoPago().subscribe(function (res) {
            _this.LstTipoPago = [];
            // tslint:disable-next-line:forin
            for (var i in res) {
                _this.LstTipoPago.push(res[i]);
            }
        });
    };
    VentasComponent.prototype.ListarTipoDocumento = function () {
        var _this = this;
        this.ServicioTipoDocumento.ListarTipoDocumento().subscribe(function (res) {
            _this.LstTipoDocumento = [];
            // tslint:disable-next-line:forin
            for (var i in res) {
                _this.LstTipoDocumento.push(res[i]);
            }
        });
    };
    VentasComponent.prototype.ListarClientes = function (inst, sede, subsede, dni, nombre, apellido) {
        var _this = this;
        this.ClienteServicio.Listado(inst, sede, subsede, dni, nombre, apellido).subscribe(function (res) {
            _this.LstCliente = [];
            console.log(res);
            // tslint:disable-next-line:forin
            for (var i in res) {
                _this.LstCliente.push(res[i]);
            }
        });
    };
    __decorate([
        core_1.ViewChild('InputFechaPago'),
        __metadata("design:type", core_1.ElementRef)
    ], VentasComponent.prototype, "FiltroFecha", void 0);
    __decorate([
        core_1.ViewChild('InputMontoTotal'),
        __metadata("design:type", core_1.ElementRef)
    ], VentasComponent.prototype, "FiltroMonto", void 0);
    __decorate([
        core_1.ViewChild('InputCuota'),
        __metadata("design:type", core_1.ElementRef)
    ], VentasComponent.prototype, "FiltroCuota", void 0);
    __decorate([
        core_1.ViewChild('Cliente'),
        __metadata("design:type", core_1.ElementRef)
    ], VentasComponent.prototype, "ClienteAutoComplete", void 0);
    VentasComponent = __decorate([
        core_1.Component({
            selector: 'app-ventas',
            templateUrl: './ventas.component.html',
            styleUrls: ['./ventas.component.css'],
            providers: [ventas_service_1.VentaService, tipodocumento_1.ServiciosTipoDocumento, tipopago_1.ServiciosTipoPago, clientes_service_1.ClienteService]
        }),
        __metadata("design:paramtypes", [ventas_service_1.VentaService,
            clientes_service_1.ClienteService,
            material_1.MatDialog,
            forms_1.FormBuilder,
            tipodocumento_1.ServiciosTipoDocumento,
            tipopago_1.ServiciosTipoPago])
    ], VentasComponent);
    return VentasComponent;
}());
exports.VentasComponent = VentasComponent;
//# sourceMappingURL=ventas.component.js.map