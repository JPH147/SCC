/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class ChartistComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhcnRpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctY2hhcnRpc3QvIiwic291cmNlcyI6WyJsaWIvY2hhcnRpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFFUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEtBQUssUUFBUSxNQUFNLFVBQVUsQ0FBQzs7Ozs7QUF3QnJDLGdDQUVDOzs7Ozs7Ozs7Ozs7Ozs7OztBQTZCRCxNQUFNLE9BQU8saUJBQWlCOzs7OztJQStDNUIsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTs7Ozs7O1FBTjFDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7SUFNTCxDQUFDOzs7OztJQUc5QyxRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQzs7Ozs7O0lBR0QsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQzs7Ozs7SUFHRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjtJQUNILENBQUM7Ozs7OztJQUdPLFdBQVc7O2NBQ1gsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYTtRQUVuRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSw0QkFBNEIsQ0FBQyxDQUFDO1NBQzNEO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLG1CQUFLLFFBQVEsRUFBQSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNyQyxhQUFhLEVBQ2IsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxpQkFBaUIsQ0FDdkIsQ0FBQztRQUVGLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNuQjtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDOzs7Ozs7O0lBR08sTUFBTSxDQUFDLE9BQXNCO1FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUM1QixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLElBQUksT0FBTyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNwQjthQUFNLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQzFDLENBQUMsbUJBQThCLElBQUksQ0FBQyxLQUFLLEVBQUEsQ0FBQyxDQUFDLE1BQU0sQ0FDL0MsSUFBSSxDQUFDLElBQUksRUFDVCxJQUFJLENBQUMsT0FBTyxDQUNiLENBQUM7U0FDSDtJQUNILENBQUM7Ozs7OztJQUdPLFVBQVU7UUFDaEIsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQzs7O1lBM0hGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLEVBQUU7eUJBRVY7Ozs7S0FJQzthQUVKOzs7O1lBaEVDLFVBQVU7OzttQkFxRVQsS0FBSzttQkFNTCxLQUFLO3NCQU1MLEtBQUs7Z0NBTUwsS0FBSztxQkFVTCxLQUFLOzBCQVFMLE1BQU07Ozs7Ozs7SUFwQ1AsaUNBQzZCOzs7OztJQUs3QixpQ0FDZ0I7Ozs7O0lBS2hCLG9DQUNnQzs7Ozs7SUFLaEMsOENBQ3FDOzs7Ozs7Ozs7SUFTckMsbUNBQ21COzs7Ozs7O0lBT25CLHdDQUNrRDs7Ozs7O0lBR2xELGtDQUErQjs7Ozs7SUFHbkIsdUNBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCAqIGFzIENoYXJ0aXN0IGZyb20gJ2NoYXJ0aXN0JztcbmltcG9ydCB7IElDaGFydGlzdEJhc2UsIElDaGFydE9wdGlvbnMgfSBmcm9tICdjaGFydGlzdCc7XG5cbi8qKlxuICogUG9zc2libGUgY2hhcnQgdHlwZXNcbiAqL1xuZXhwb3J0IHR5cGUgQ2hhcnRUeXBlID0gJ1BpZScgfCAnQmFyJyB8ICdMaW5lJztcblxuZXhwb3J0IHR5cGUgQ2hhcnRJbnRlcmZhY2VzID1cbiAgfCBDaGFydGlzdC5JQ2hhcnRpc3RQaWVDaGFydFxuICB8IENoYXJ0aXN0LklDaGFydGlzdEJhckNoYXJ0XG4gIHwgQ2hhcnRpc3QuSUNoYXJ0aXN0TGluZUNoYXJ0O1xuZXhwb3J0IHR5cGUgQ2hhcnRPcHRpb25zID1cbiAgfCBDaGFydGlzdC5JQmFyQ2hhcnRPcHRpb25zXG4gIHwgQ2hhcnRpc3QuSUxpbmVDaGFydE9wdGlvbnNcbiAgfCBDaGFydGlzdC5JUGllQ2hhcnRPcHRpb25zO1xuZXhwb3J0IHR5cGUgUmVzcG9uc2l2ZU9wdGlvblR1cGxlID0gQ2hhcnRpc3QuSVJlc3BvbnNpdmVPcHRpb25UdXBsZTxcbiAgQ2hhcnRPcHRpb25zXG4+O1xuZXhwb3J0IHR5cGUgUmVzcG9uc2l2ZU9wdGlvbnMgPSBSZXNwb25zaXZlT3B0aW9uVHVwbGVbXTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGNoYXJ0IGV2ZW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDaGFydEV2ZW50IHtcbiAgW2V2ZW50TmFtZTogc3RyaW5nXTogKGRhdGE6IGFueSkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB3aGljaCByZW5kZXJzIENoYXJ0aXN0IGNoYXJ0LlxuICpcbiAqIFNlZSBDaGFydGlzdCB7QGxpbmsgaHR0cHM6Ly9naW9ua3Vuei5naXRodWIuaW8vY2hhcnRpc3QtanMvYXBpLWRvY3VtZW50YXRpb24uaHRtbCBBUEkgZG9jdW1lbnRhdGlvbn0gYW5kXG4gKiB7QGxpbmsgaHR0cHM6Ly9naW9ua3Vuei5naXRodWIuaW8vY2hhcnRpc3QtanMvZXhhbXBsZXMuaHRtbCBleGFtcGxlc30gZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKiAjIyMgRXhhbXBsZVxuIGBgYGh0bWxcbiA8eC1jaGFydGlzdFxuICAgW3R5cGVdPVwidHlwZVwiXG4gICBbZGF0YV09XCJkYXRhXCJcbiAgIFtvcHRpb25zXT1cIm9wdGlvbnNcIlxuICAgW3Jlc3BvbnNpdmVPcHRpb25zXT1cInJlc3BvbnNpdmVPcHRpb25zXCJcbiAgIFtldmVudHNdPVwiZXZlbnRzXCJcbiA+PC94LWNoYXJ0aXN0PlxuIGBgYFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd4LWNoYXJ0aXN0JyxcbiAgdGVtcGxhdGU6ICcnLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICA6aG9zdCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgfVxuICAgIGBcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBDaGFydGlzdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogVGhlIGRhdGEgb2JqZWN0IHRoYXQgbmVlZHMgdG8gY29uc2lzdCBvZiBhIGxhYmVscyBhbmQgYSBzZXJpZXMgYXJyYXkuXG4gICAqL1xuICBASW5wdXQoKVxuICBkYXRhOiBDaGFydGlzdC5JQ2hhcnRpc3REYXRhO1xuXG4gIC8qKlxuICAgKiBDaGFydGlzdCBjaGFydCB0eXBlLlxuICAgKi9cbiAgQElucHV0KClcbiAgdHlwZTogQ2hhcnRUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgb3B0aW9ucyBvYmplY3Qgd2hpY2ggb3ZlcnJpZGVzIHRoZSBkZWZhdWx0IG9wdGlvbnMuXG4gICAqL1xuICBASW5wdXQoKVxuICBvcHRpb25zOiBDaGFydGlzdC5JQ2hhcnRPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiByZXNwb25zaXZlIG9wdGlvbiBhcnJheXMgd2hpY2ggYXJlIGEgbWVkaWEgcXVlcnkgYW5kIG9wdGlvbnMgb2JqZWN0IHBhaXI6IFtbbWVkaWFRdWVyeVN0cmluZywgb3B0aW9uc09iamVjdF0sW21vcmUuLi5dXVxuICAgKi9cbiAgQElucHV0KClcbiAgcmVzcG9uc2l2ZU9wdGlvbnM6IFJlc3BvbnNpdmVPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBFdmVudHMgb2JqZWN0IHdoZXJlIGtleXMgYXJlIENoYXJ0aXN0IGV2ZW50IG5hbWVzIGFuZCB2YWx1ZXMgYXJlIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zLlxuICAgKlxuICAgKiBTdXBwb3J0ZWQgZXZlbnRzIGFyZTogZHJhdywgb3B0aW9uc0NoYW5nZWQsIGRhdGEsIGFuaW1hdGlvbkJlZ2luLCBhbmltYXRpb25FbmQsIGNyZWF0ZWQuXG4gICAqXG4gICAqIEV2ZW50IGhhbmRsZXIgZnVuY3Rpb24gd2lsbCByZWNlaXZlIGEgZGF0YSBhcmd1bWVudCB3aGljaCBjb250YWlucyBldmVudCBkYXRhLlxuICAgKi9cbiAgQElucHV0KClcbiAgZXZlbnRzOiBDaGFydEV2ZW50O1xuXG4gIC8qKlxuICAgKiBFdmVudCBlbWl0dGVkIGFmdGVyIENoYXJ0aXN0IGNoYXJ0IGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKlxuICAgKiBFdmVudCBoYW5kbGVyIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBjaGFydCBpbnN0YW5jZSBhcmd1bWVudC5cbiAgICovXG4gIEBPdXRwdXQoKVxuICBpbml0aWFsaXplZCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRJbnRlcmZhY2VzPigpO1xuXG4gIC8qKiBAaWdub3JlICovXG4gIHByaXZhdGUgY2hhcnQ6IENoYXJ0SW50ZXJmYWNlcztcblxuICAvKiogQGlnbm9yZSAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgLyoqIEBpZ25vcmUgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHlwZSAmJiB0aGlzLmRhdGEpIHtcbiAgICAgIHRoaXMucmVuZGVyQ2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGlnbm9yZSAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGUoY2hhbmdlcyk7XG4gIH1cblxuICAvKiogQGlnbm9yZSAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5kZXRhY2goKTtcbiAgICAgIHRoaXMuY2hhcnQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaWdub3JlICovXG4gIHByaXZhdGUgcmVuZGVyQ2hhcnQoKSB7XG4gICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKCEodGhpcy50eXBlIGluIENoYXJ0aXN0KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMudHlwZX0gaXMgbm90IGEgdmFsaWQgY2hhcnQgdHlwZWApO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnQgPSAoPGFueT5DaGFydGlzdClbdGhpcy50eXBlXShcbiAgICAgIG5hdGl2ZUVsZW1lbnQsXG4gICAgICB0aGlzLmRhdGEsXG4gICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICB0aGlzLnJlc3BvbnNpdmVPcHRpb25zXG4gICAgKTtcblxuICAgIGlmICh0aGlzLmV2ZW50cykge1xuICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplZC5lbWl0KHRoaXMuY2hhcnQpO1xuICB9XG5cbiAgLyoqIEBpZ25vcmUgKi9cbiAgcHJpdmF0ZSB1cGRhdGUoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICghdGhpcy50eXBlIHx8ICF0aGlzLmRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2hhcnQgfHwgJ3R5cGUnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMucmVuZGVyQ2hhcnQoKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZXMuZGF0YSB8fCBjaGFuZ2VzLm9wdGlvbnMpIHtcbiAgICAgICg8SUNoYXJ0aXN0QmFzZTxJQ2hhcnRPcHRpb25zPj50aGlzLmNoYXJ0KS51cGRhdGUoXG4gICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgdGhpcy5vcHRpb25zXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaWdub3JlICovXG4gIHByaXZhdGUgYmluZEV2ZW50cygpOiB2b2lkIHtcbiAgICBmb3IgKGNvbnN0IGV2ZW50IG9mIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRzKSkge1xuICAgICAgdGhpcy5jaGFydC5vbihldmVudCwgdGhpcy5ldmVudHNbZXZlbnRdKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==