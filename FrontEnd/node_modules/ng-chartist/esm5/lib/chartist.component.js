/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import * as Chartist from 'chartist';
/**
 * Represents chart events.
 * @record
 */
export function ChartEvent() { }
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
        this.initialized = new EventEmitter();
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
        this.chart = ((/** @type {?} */ (Chartist)))[this.type](nativeElement, this.data, this.options, this.responsiveOptions);
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
            ((/** @type {?} */ (this.chart))).update(this.data, this.options);
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
            for (var _b = tslib_1.__values(Object.keys(this.events)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var event_1 = _c.value;
                this.chart.on(event_1, this.events[event_1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ChartistComponent.decorators = [
        { type: Component, args: [{
                    selector: 'x-chartist',
                    template: '',
                    styles: ["\n      :host {\n        display: block;\n      }\n    "]
                }] }
    ];
    /** @nocollapse */
    ChartistComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    ChartistComponent.propDecorators = {
        data: [{ type: Input }],
        type: [{ type: Input }],
        options: [{ type: Input }],
        responsiveOptions: [{ type: Input }],
        events: [{ type: Input }],
        initialized: [{ type: Output }]
    };
    return ChartistComponent;
}());
export { ChartistComponent };
if (false) {
    /**
     * The data object that needs to consist of a labels and a series array.
     * @type {?}
     */
    ChartistComponent.prototype.data;
    /**
     * Chartist chart type.
     * @type {?}
     */
    ChartistComponent.prototype.type;
    /**
     * The options object which overrides the default options.
     * @type {?}
     */
    ChartistComponent.prototype.options;
    /**
     * An array of responsive option arrays which are a media query and options object pair: [[mediaQueryString, optionsObject],[more...]]
     * @type {?}
     */
    ChartistComponent.prototype.responsiveOptions;
    /**
     * Events object where keys are Chartist event names and values are event handler functions.
     *
     * Supported events are: draw, optionsChanged, data, animationBegin, animationEnd, created.
     *
     * Event handler function will receive a data argument which contains event data.
     * @type {?}
     */
    ChartistComponent.prototype.events;
    /**
     * Event emitted after Chartist chart has been initialized.
     *
     * Event handler function will receive chart instance argument.
     * @type {?}
     */
    ChartistComponent.prototype.initialized;
    /**
     * @ignore
     * @type {?}
     * @private
     */
    ChartistComponent.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    ChartistComponent.prototype.elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnRpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctY2hhcnRpc3QvIiwic291cmNlcyI6WyJsaWIvY2hhcnRpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFJTCxNQUFNLEVBRVAsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxLQUFLLFFBQVEsTUFBTSxVQUFVLENBQUM7Ozs7O0FBd0JyQyxnQ0FFQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkQ7SUF5REUsY0FBYztJQUNkLDJCQUFvQixVQUFzQjtRQUF0QixlQUFVLEdBQVYsVUFBVSxDQUFZOzs7Ozs7UUFOMUMsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztJQU1MLENBQUM7SUFFOUMsY0FBYzs7Ozs7SUFDZCxvQ0FBUTs7OztJQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELGNBQWM7Ozs7OztJQUNkLHVDQUFXOzs7OztJQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsY0FBYzs7Ozs7SUFDZCx1Q0FBVzs7OztJQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFRCxjQUFjOzs7Ozs7SUFDTix1Q0FBVzs7Ozs7SUFBbkI7O1lBQ1EsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYTtRQUVuRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUksSUFBSSxDQUFDLElBQUksK0JBQTRCLENBQUMsQ0FBQztTQUMzRDtRQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxtQkFBSyxRQUFRLEVBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDckMsYUFBYSxFQUNiLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsaUJBQWlCLENBQ3ZCLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELGNBQWM7Ozs7Ozs7SUFDTixrQ0FBTTs7Ozs7O0lBQWQsVUFBZSxPQUFzQjtRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUNwQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7YUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUMxQyxDQUFDLG1CQUE4QixJQUFJLENBQUMsS0FBSyxFQUFBLENBQUMsQ0FBQyxNQUFNLENBQy9DLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLE9BQU8sQ0FDYixDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRUQsY0FBYzs7Ozs7O0lBQ04sc0NBQVU7Ozs7O0lBQWxCOzs7WUFDRSxLQUFvQixJQUFBLEtBQUEsaUJBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQXpDLElBQU0sT0FBSyxXQUFBO2dCQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQUssQ0FBQyxDQUFDLENBQUM7YUFDMUM7Ozs7Ozs7OztJQUNILENBQUM7O2dCQTNIRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLFFBQVEsRUFBRSxFQUFFOzZCQUVWLHlEQUlDO2lCQUVKOzs7O2dCQWhFQyxVQUFVOzs7dUJBcUVULEtBQUs7dUJBTUwsS0FBSzswQkFNTCxLQUFLO29DQU1MLEtBQUs7eUJBVUwsS0FBSzs4QkFRTCxNQUFNOztJQXlFVCx3QkFBQztDQUFBLEFBNUhELElBNEhDO1NBakhZLGlCQUFpQjs7Ozs7O0lBSTVCLGlDQUM2Qjs7Ozs7SUFLN0IsaUNBQ2dCOzs7OztJQUtoQixvQ0FDZ0M7Ozs7O0lBS2hDLDhDQUNxQzs7Ozs7Ozs7O0lBU3JDLG1DQUNtQjs7Ozs7OztJQU9uQix3Q0FDa0Q7Ozs7OztJQUdsRCxrQ0FBK0I7Ozs7O0lBR25CLHVDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgKiBhcyBDaGFydGlzdCBmcm9tICdjaGFydGlzdCc7XG5pbXBvcnQgeyBJQ2hhcnRpc3RCYXNlLCBJQ2hhcnRPcHRpb25zIH0gZnJvbSAnY2hhcnRpc3QnO1xuXG4vKipcbiAqIFBvc3NpYmxlIGNoYXJ0IHR5cGVzXG4gKi9cbmV4cG9ydCB0eXBlIENoYXJ0VHlwZSA9ICdQaWUnIHwgJ0JhcicgfCAnTGluZSc7XG5cbmV4cG9ydCB0eXBlIENoYXJ0SW50ZXJmYWNlcyA9XG4gIHwgQ2hhcnRpc3QuSUNoYXJ0aXN0UGllQ2hhcnRcbiAgfCBDaGFydGlzdC5JQ2hhcnRpc3RCYXJDaGFydFxuICB8IENoYXJ0aXN0LklDaGFydGlzdExpbmVDaGFydDtcbmV4cG9ydCB0eXBlIENoYXJ0T3B0aW9ucyA9XG4gIHwgQ2hhcnRpc3QuSUJhckNoYXJ0T3B0aW9uc1xuICB8IENoYXJ0aXN0LklMaW5lQ2hhcnRPcHRpb25zXG4gIHwgQ2hhcnRpc3QuSVBpZUNoYXJ0T3B0aW9ucztcbmV4cG9ydCB0eXBlIFJlc3BvbnNpdmVPcHRpb25UdXBsZSA9IENoYXJ0aXN0LklSZXNwb25zaXZlT3B0aW9uVHVwbGU8XG4gIENoYXJ0T3B0aW9uc1xuPjtcbmV4cG9ydCB0eXBlIFJlc3BvbnNpdmVPcHRpb25zID0gUmVzcG9uc2l2ZU9wdGlvblR1cGxlW107XG5cbi8qKlxuICogUmVwcmVzZW50cyBjaGFydCBldmVudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2hhcnRFdmVudCB7XG4gIFtldmVudE5hbWU6IHN0cmluZ106IChkYXRhOiBhbnkpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgd2hpY2ggcmVuZGVycyBDaGFydGlzdCBjaGFydC5cbiAqXG4gKiBTZWUgQ2hhcnRpc3Qge0BsaW5rIGh0dHBzOi8vZ2lvbmt1bnouZ2l0aHViLmlvL2NoYXJ0aXN0LWpzL2FwaS1kb2N1bWVudGF0aW9uLmh0bWwgQVBJIGRvY3VtZW50YXRpb259IGFuZFxuICoge0BsaW5rIGh0dHBzOi8vZ2lvbmt1bnouZ2l0aHViLmlvL2NoYXJ0aXN0LWpzL2V4YW1wbGVzLmh0bWwgZXhhbXBsZXN9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICogIyMjIEV4YW1wbGVcbiBgYGBodG1sXG4gPHgtY2hhcnRpc3RcbiAgIFt0eXBlXT1cInR5cGVcIlxuICAgW2RhdGFdPVwiZGF0YVwiXG4gICBbb3B0aW9uc109XCJvcHRpb25zXCJcbiAgIFtyZXNwb25zaXZlT3B0aW9uc109XCJyZXNwb25zaXZlT3B0aW9uc1wiXG4gICBbZXZlbnRzXT1cImV2ZW50c1wiXG4gPjwveC1jaGFydGlzdD5cbiBgYGBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAneC1jaGFydGlzdCcsXG4gIHRlbXBsYXRlOiAnJyxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgOmhvc3Qge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIH1cbiAgICBgXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ2hhcnRpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFRoZSBkYXRhIG9iamVjdCB0aGF0IG5lZWRzIHRvIGNvbnNpc3Qgb2YgYSBsYWJlbHMgYW5kIGEgc2VyaWVzIGFycmF5LlxuICAgKi9cbiAgQElucHV0KClcbiAgZGF0YTogQ2hhcnRpc3QuSUNoYXJ0aXN0RGF0YTtcblxuICAvKipcbiAgICogQ2hhcnRpc3QgY2hhcnQgdHlwZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHR5cGU6IENoYXJ0VHlwZTtcblxuICAvKipcbiAgICogVGhlIG9wdGlvbnMgb2JqZWN0IHdoaWNoIG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBvcHRpb25zLlxuICAgKi9cbiAgQElucHV0KClcbiAgb3B0aW9uczogQ2hhcnRpc3QuSUNoYXJ0T3B0aW9ucztcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgcmVzcG9uc2l2ZSBvcHRpb24gYXJyYXlzIHdoaWNoIGFyZSBhIG1lZGlhIHF1ZXJ5IGFuZCBvcHRpb25zIG9iamVjdCBwYWlyOiBbW21lZGlhUXVlcnlTdHJpbmcsIG9wdGlvbnNPYmplY3RdLFttb3JlLi4uXV1cbiAgICovXG4gIEBJbnB1dCgpXG4gIHJlc3BvbnNpdmVPcHRpb25zOiBSZXNwb25zaXZlT3B0aW9ucztcblxuICAvKipcbiAgICogRXZlbnRzIG9iamVjdCB3aGVyZSBrZXlzIGFyZSBDaGFydGlzdCBldmVudCBuYW1lcyBhbmQgdmFsdWVzIGFyZSBldmVudCBoYW5kbGVyIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogU3VwcG9ydGVkIGV2ZW50cyBhcmU6IGRyYXcsIG9wdGlvbnNDaGFuZ2VkLCBkYXRhLCBhbmltYXRpb25CZWdpbiwgYW5pbWF0aW9uRW5kLCBjcmVhdGVkLlxuICAgKlxuICAgKiBFdmVudCBoYW5kbGVyIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhIGRhdGEgYXJndW1lbnQgd2hpY2ggY29udGFpbnMgZXZlbnQgZGF0YS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGV2ZW50czogQ2hhcnRFdmVudDtcblxuICAvKipcbiAgICogRXZlbnQgZW1pdHRlZCBhZnRlciBDaGFydGlzdCBjaGFydCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogRXZlbnQgaGFuZGxlciBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgY2hhcnQgaW5zdGFuY2UgYXJndW1lbnQuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgaW5pdGlhbGl6ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0SW50ZXJmYWNlcz4oKTtcblxuICAvKiogQGlnbm9yZSAqL1xuICBwcml2YXRlIGNoYXJ0OiBDaGFydEludGVyZmFjZXM7XG5cbiAgLyoqIEBpZ25vcmUgKi9cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuXG4gIC8qKiBAaWdub3JlICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnR5cGUgJiYgdGhpcy5kYXRhKSB7XG4gICAgICB0aGlzLnJlbmRlckNoYXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpZ25vcmUgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlKGNoYW5nZXMpO1xuICB9XG5cbiAgLyoqIEBpZ25vcmUgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgIHRoaXMuY2hhcnQuZGV0YWNoKCk7XG4gICAgICB0aGlzLmNoYXJ0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogQGlnbm9yZSAqL1xuICBwcml2YXRlIHJlbmRlckNoYXJ0KCkge1xuICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGlmICghKHRoaXMudHlwZSBpbiBDaGFydGlzdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLnR5cGV9IGlzIG5vdCBhIHZhbGlkIGNoYXJ0IHR5cGVgKTtcbiAgICB9XG5cbiAgICB0aGlzLmNoYXJ0ID0gKDxhbnk+Q2hhcnRpc3QpW3RoaXMudHlwZV0oXG4gICAgICBuYXRpdmVFbGVtZW50LFxuICAgICAgdGhpcy5kYXRhLFxuICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgdGhpcy5yZXNwb25zaXZlT3B0aW9uc1xuICAgICk7XG5cbiAgICBpZiAodGhpcy5ldmVudHMpIHtcbiAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQuZW1pdCh0aGlzLmNoYXJ0KTtcbiAgfVxuXG4gIC8qKiBAaWdub3JlICovXG4gIHByaXZhdGUgdXBkYXRlKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudHlwZSB8fCAhdGhpcy5kYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNoYXJ0IHx8ICd0eXBlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLnJlbmRlckNoYXJ0KCk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2VzLmRhdGEgfHwgY2hhbmdlcy5vcHRpb25zKSB7XG4gICAgICAoPElDaGFydGlzdEJhc2U8SUNoYXJ0T3B0aW9ucz4+dGhpcy5jaGFydCkudXBkYXRlKFxuICAgICAgICB0aGlzLmRhdGEsXG4gICAgICAgIHRoaXMub3B0aW9uc1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGlnbm9yZSAqL1xuICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XG4gICAgZm9yIChjb25zdCBldmVudCBvZiBPYmplY3Qua2V5cyh0aGlzLmV2ZW50cykpIHtcbiAgICAgIHRoaXMuY2hhcnQub24oZXZlbnQsIHRoaXMuZXZlbnRzW2V2ZW50XSk7XG4gICAgfVxuICB9XG59XG4iXX0=