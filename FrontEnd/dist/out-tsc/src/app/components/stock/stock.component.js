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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var StockComponent = /** @class */ (function () {
    function StockComponent(http) {
        this.http = http;
        this.displayedColumns = ['created', 'state', 'number', 'title'];
        this.data = [];
        this.resultsLength = 0;
        this.isLoadingResults = true;
        this.isRateLimitReached = false;
    }
    StockComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.exampleDatabase = new ExampleHttpDao(this.http);
        // If the user changes the sort order, reset back to the first page.
        this.sort.sortChange.subscribe(function () { return _this.paginator.pageIndex = 0; });
        rxjs_1.merge(this.sort.sortChange, this.paginator.page)
            .pipe(operators_1.startWith({}), operators_1.switchMap(function () {
            _this.isLoadingResults = true;
            // tslint:disable-next-line:no-non-null-assertion
            return _this.exampleDatabase.getRepoIssues(_this.sort.active, _this.sort.direction, _this.paginator.pageIndex);
        }), operators_1.map(function (data) {
            // Flip flag to show that loading has finished.
            _this.isLoadingResults = false;
            _this.isRateLimitReached = false;
            _this.resultsLength = data.total_count;
            return data.items;
        }), operators_1.catchError(function () {
            _this.isLoadingResults = false;
            // Catch if the GitHub API has reached its rate limit. Return empty data.
            _this.isRateLimitReached = true;
            return rxjs_1.of([]);
        })).subscribe(function (data) { return _this.data = data; });
    };
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], StockComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort),
        __metadata("design:type", material_1.MatSort)
    ], StockComponent.prototype, "sort", void 0);
    StockComponent = __decorate([
        core_1.Component({
            selector: 'app-stock',
            templateUrl: './stock.component.html',
            styleUrls: ['./stock.component.css']
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], StockComponent);
    return StockComponent;
}());
exports.StockComponent = StockComponent;
/** An example database that the data source uses to retrieve data for the table. */
var ExampleHttpDao = /** @class */ (function () {
    function ExampleHttpDao(http) {
        this.http = http;
    }
    ExampleHttpDao.prototype.getRepoIssues = function (sort, order, page) {
        var href = 'https://api.github.com/search/issues';
        var requestUrl = href + "?q=repo:angular/material2&sort=" + sort + "&order=" + order + "&page=" + (page + 1);
        return this.http.get(requestUrl);
    };
    return ExampleHttpDao;
}());
exports.ExampleHttpDao = ExampleHttpDao;
//# sourceMappingURL=stock.component.js.map