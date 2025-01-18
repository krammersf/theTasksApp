import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';  // Importando o MatSnackBar
import { Subject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) { }

  showSnackbar(message: string = 'Concluído.', type: string = 'default', duration: number = 2000): void {
    this.snackBar.open(message, 'Fechar', {
      duration: duration,
      panelClass: this.getSnackbarClass(type),
    });
  }

  private getSnackbarClass(type: string): string {
    switch (type) {
      case 'success':
        return 'snackbar-success';
      case 'error':
        return 'snackbar-error';
      case 'info':
        return 'snackbar-info';
      case 'warning':
        return 'snackbar-warning';
      default:
        return 'snackbar-default';
    }
  }


}
