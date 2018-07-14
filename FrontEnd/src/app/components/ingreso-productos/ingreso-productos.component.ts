import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-ingreso-productos',
  templateUrl: './ingreso-productos.component.html',
  styleUrls: ['./ingreso-productos.component.css'],
})

  export class IngresoProductosComponent implements OnInit {
    selected = 'option2';
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

    selection = new SelectionModel<PeriodicElement>(true, []);
    foods: Food[] = [
      {value: 'steak-0', viewValue: 'Almacen Principal'},
      {value: 'pizza-1', viewValue: 'Almacen Dos'},
      {value: 'tacos-2', viewValue: 'Almacen Tres'}
    ];

    constructor() { }

    ngOnInit() {
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }
    isAllSelected() {

    }

/** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {

    }
  }

  export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
  }


