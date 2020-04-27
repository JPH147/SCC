(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('chartist'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ng-chartist', ['exports', 'chartist', '@angular/core'], factory) :
    (factory((global['ng-chartist'] = {}),global.Chartist,global.ng.core));
}(this, (function (exports,Chartist,core) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Angular component which renders Chartist chart.
     *
     * See Chartist {\@link https://gionkunz.github.io/chartist-js/api-documentation.html API documentation} and
     * {\@link https://gionkunz.github.io/chartist-js/examples.html examples} for more information.
     * ### Example
     * ```html
     * <x-chartist
     * [type]="type"
     * [data]="data"
     * [options]="options"
     * [responsiveOptions]="responsiveOptions"
     * [events]="events"
     * ></x-chartist>
     * ```
     */
    var ChartistComponent = /** @class */ (function () {
        /** @ignore */
        function ChartistComponent(elementRef) {
            this.elementRef = elementRef;
            /**
             * Event emitted after Chartist chart has been initialized.
             *
             * Event handler function will receive chart instance argument.
             */
            this.initialized = new core.EventEmitter();
        }
        /** @ignore */
        /**
         * @ignore
         * @return {?}
         */
        ChartistComponent.prototype.ngOnInit = /**
         * @ignore
         * @return {?}
         */
            function () {
                if (this.type && this.data) {
                    this.renderChart();
                }
            };
        /** @ignore */
        /**
         * @ignore
         * @param {?} changes
         * @return {?}
         */
        ChartistComponent.prototype.ngOnChanges = /**
         * @ignore
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                this.update(changes);
            };
        /** @ignore */
        /**
         * @ignore
         * @return {?}
         */
        ChartistComponent.prototype.ngOnDestroy = /**
         * @ignore
         * @return {?}
         */
            function () {
                if (this.chart) {
                    this.chart.detach();
                    this.chart = null;
                }
            };
        /** @ignore */
        /**
         * @ignore
         * @private
         * @return {?}
         */
        ChartistComponent.prototype.renderChart = /**
         * @ignore
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var nativeElement = this.elementRef.nativeElement;
                if (!(this.type in Chartist)) {
                    throw new Error(this.type + " is not a valid chart type");
                }
                this.chart = (( /** @type {?} */(Chartist)))[this.type](nativeElement, this.data, this.options, this.responsiveOptions);
                if (this.events) {
                    this.bindEvents();
                }
                this.initialized.emit(this.chart);
            };
        /** @ignore */
        /**
         * @ignore
         * @private
         * @param {?} changes
         * @return {?}
         */
        ChartistComponent.prototype.update = /**
         * @ignore
         * @private
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (!this.type || !this.data) {
                    return;
                }
                if (!this.chart || 'type' in changes) {
                    this.renderChart();
                }
                else if (changes.data || changes.options) {
                    (( /** @type {?} */(this.chart))).update(this.data, this.options);
                }
            };
        /** @ignore */
        /**
         * @ignore
         * @private
         * @return {?}
         */
        ChartistComponent.prototype.bindEvents = /**
         * @ignore
         * @private
         * @return {?}
         */
            function () {
                var e_1, _a;
                try {
                    for (var _b = __values(Object.keys(this.events)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var event_1 = _c.value;
                        this.chart.on(event_1, this.events[event_1]);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
            };
        ChartistComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'x-chartist',
                        template: '',
                        styles: ["\n      :host {\n        display: block;\n      }\n    "]
                    }] }
        ];
        /** @nocollapse */
        ChartistComponent.ctorParameters = function () {
            return [
                { type: core.ElementRef }
            ];
        };
        ChartistComponent.propDecorators = {
            data: [{ type: core.Input }],
            type: [{ type: core.Input }],
            options: [{ type: core.Input }],
            responsiveOptions: [{ type: core.Input }],
            events: [{ type: core.Input }],
            initialized: [{ type: core.Output }]
        };
        return ChartistComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var ChartistModule = /** @class */ (function () {
        function ChartistModule() {
        }
        ChartistModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [ChartistComponent],
                        imports: [],
                        exports: [ChartistComponent]
                    },] }
        ];
        return ChartistModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.ChartistComponent = ChartistComponent;
    exports.ChartistModule = ChartistModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ng-chartist.umd.js.map