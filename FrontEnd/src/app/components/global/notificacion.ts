import {Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()

export class Notificaciones{

  constructor(
    private snackBar: MatSnackBar
  ){ };

  Snack(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}