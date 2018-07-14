import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
})
// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteProductos {
  selectedValue: string;

  foods: Food[] = [
    {value: 'Televisor', viewValue: 'Televisor'},
    {value: 'Celular', viewValue: 'Celular'},
    {value: 'Cocina', viewValue: 'Cocina'}
  ];

  constructor(
    public dialogRef: MatDialogRef<VentanaEmergenteProductos>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export class InputErrorStateMatcherExample {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
}

export class SelectFormExample {
  selectedValue: string;
}


