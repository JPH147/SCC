import * as Chartist from 'chartist';
import { Component, ElementRef, EventEmitter, Input, Output, NgModule } from '@angular/core';

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
class ChartistComponent {
    /**
     * @ignore
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.elementRef = elementRef;
        /**
         * Event emitted after Chartist chart has been initialized.
         *
         * Event handler function will receive chart instance argument.
         */
        this.initialized = new EventEmitter();
    }
    /**
     * @ignore
     * @return {?}
     */
    ngOnInit() {
        if (this.type && this.data) {
            this.renderChart();
        }
    }
    /**
     * @ignore
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.update(changes);
    }
    /**
     * @ignore
     * @return {?}
     */
    ngOnDestroy() {
        if (this.chart) {
            this.chart.detach();
            this.chart = null;
        }
    }
    /**
     * @ignore
     * @private
     * @return {?}
     */
    renderChart() {
        /** @type {?} */
        const nativeElement = this.elementRef.nativeElement;
        if (!(this.type in Chartist)) {
            throw new Error(`${this.type} is not a valid chart type`);
        }
        this.chart = ((/** @type {?} */ (Chartist)))[this.type](nativeElement, this.data, this.options, this.responsiveOptions);
        if (this.events) {
            this.bindEvents();
        }
        this.initialized.emit(this.chart);
    }
    /**
     * @ignore
     * @private
     * @param {?} changes
     * @return {?}
     */
    update(changes) {
        if (!this.type || !this.data) {
            return;
        }
        if (!this.chart || 'type' in changes) {
            this.renderChart();
        }
        else if (changes.data || changes.options) {
            ((/** @type {?} */ (this.chart))).update(this.data, this.options);
        }
    }
    /**
     * @ignore
     * @private
     * @return {?}
     */
    bindEvents() {
        for (const event of Object.keys(this.events)) {
            this.chart.on(event, this.events[event]);
        }
    }
}
ChartistComponent.decorators = [
    { type: Component, args: [{
                selector: 'x-chartist',
                template: '',
                styles: [`
      :host {
        display: block;
      }
    `]
            }] }
];
/** @nocollapse */
ChartistComponent.ctorParameters = () => [
    { type: ElementRef }
];
ChartistComponent.propDecorators = {
    data: [{ type: Input }],
    type: [{ type: Input }],
    options: [{ type: Input }],
    responsiveOptions: [{ type: Input }],
    events: [{ type: Input }],
    initialized: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ChartistModule {
}
ChartistModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ChartistComponent],
                imports: [],
                exports: [ChartistComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { ChartistComponent, ChartistModule };

//# sourceMappingURL=ng-chartist.js.map