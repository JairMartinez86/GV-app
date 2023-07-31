import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.scss']
})
export class WaitComponent {

  constructor(
    public dialogRef: MatDialogRef<WaitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[],
  ){}

}
