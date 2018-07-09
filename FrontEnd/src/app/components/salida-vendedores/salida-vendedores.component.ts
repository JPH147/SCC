import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-salida-vendedores',
  templateUrl: './salida-vendedores.component.html',
  styleUrls: ['./salida-vendedores.component.css']
})

export class SalidaVendedoresComponent implements OnInit {
  animal: string;
  name: string;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  constructor(public dialog: MatDialog) {}

openDialog(): void {
  const dialogRef = this.dialog.open(DialogoComponent, {
    width: '250px',
    data: {name: this.name, animal: this.animal}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    this.animal = result;
  });
}


 ngOnInit() {}
}

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.html',
})
export class DialogoComponent {


  constructor(
    public dialogRef: MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

