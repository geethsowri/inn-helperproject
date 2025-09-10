import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule, MatIconButton],
  templateUrl: 'dialog.component.html'
})
export class DialogComponent {
  length: number;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.length = Object.keys(data).filter(key => !isNaN(Number(key))).length;
  }
}
