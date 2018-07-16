import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


@Component({
  selector: 'app-ventanaemergente',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteProductos {
  
  public selectedValue: string;
  public ProductosForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<VentanaEmergenteProductos>,
    @Inject(MAT_DIALOG_DATA) public data,
    private FormBuilder: FormBuilder,
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.ProductosForm = this.FormBuilder.group({
      'tipo': [null,[
        Validators.required
      ]],
      'marca':[null,[
        Validators.required
      ]],
      'modelo':[null,[
        Validators.required
      ]],
      'precio':[null,[
        Validators.required,
        Validators.pattern("[0-9- ]+")
      ]],
      'descripcion':[null,[
        Validators.required
      ]],
    })
  }

}
