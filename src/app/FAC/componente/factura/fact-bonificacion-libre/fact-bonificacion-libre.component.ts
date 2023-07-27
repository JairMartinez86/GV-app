import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fact-bonificacion-libre',
  templateUrl: './fact-bonificacion-libre.component.html',
  styleUrls: ['./fact-bonificacion-libre.component.scss']
})
export class FactBonificacionLibreComponent {

  constructor(
    public dialogRef: MatDialogRef<FactBonificacionLibreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: String,
  ){}
}
