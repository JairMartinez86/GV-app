import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-fact-delivery',
  templateUrl: './fact-delivery.component.html',
  styleUrls: ['./fact-delivery.component.scss']
})
export class FactDeliveryComponent {

  constructor(
    public dialogRef: MatDialogRef<FactDeliveryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ){}

}
