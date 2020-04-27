import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as Chartist from 'chartist';
/**
 * Possible chart types
 */
export declare type ChartType = 'Pie' | 'Bar' | 'Line';
export declare type ChartInterfaces = Chartist.IChartistPieChart | Chartist.IChartistBarChart | Chartist.IChartistLineChart;
export declare type ChartOptions = Chartist.IBarChartOptions | Chartist.ILineChartOptions | Chartist.IPieChartOptions;
export declare type ResponsiveOptionTuple = Chartist.IResponsiveOptionTuple<ChartOptions>;
export declare type ResponsiveOptions = ResponsiveOptionTuple[];
/**
 * Represents chart events.
 */
export interface ChartEvent {
    [eventName: string]: (data: any) => void;
}
/**
 * Angular component which renders Chartist chart.
 *
 * See Chartist {@link https://gionkunz.github.io/chartist-js/api-documentation.html API documentation} and
 * {@link https://gionkunz.github.io/chartist-js/examples.html examples} for more information.
 * ### Example
 ```html
 <x-chartist
   [type]="type"
   [data]="data"
   [options]="options"
   [responsiveOptions]="responsiveOptions"
   [events]="events"
 ></x-chartist>
 ```
 */
export declare class ChartistComponent implements OnInit, OnChanges, OnDestroy {
    private elementRef;
    /**
     * The data object that needs to consist of a labels and a series array.
     */
    data: Chartist.IChartistData;
    /**
     * Chartist chart type.
     */
    type: ChartType;
    /**
     * The options object which overrides the default options.
     */
    options: Chartist.IChartOptions;
    /**
     * An array of responsive option arrays which are a media query and options object pair: [[mediaQueryString, optionsObject],[more...]]
     */
    responsiveOptions: ResponsiveOptions;
    /**
     * Events object where keys are Chartist event names and values are event handler functions.
     *
     * Supported events are: draw, optionsChanged, data, animationBegin, animationEnd, created.
     *
     * Event handler function will receive a data argument which contains event data.
     */
    events: ChartEvent;
    /**
     * Event emitted after Chartist chart has been initialized.
     *
     * Event handler function will receive chart instance argument.
     */
    initialized: EventEmitter<ChartInterfaces>;
    /** @ignore */
    private chart;
    /** @ignore */
    constructor(elementRef: ElementRef);
    /** @ignore */
    ngOnInit(): void;
    /** @ignore */
    ngOnChanges(changes: SimpleChanges): void;
    /** @ignore */
    ngOnDestroy(): void;
    /** @ignore */
    private renderChart;
    /** @ignore */
    private update;
    /** @ignore */
    private bindEvents;
}
