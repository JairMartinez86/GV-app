import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-confirmar',
  templateUrl: './dialogo-confirmar.component.html',
  styleUrls: ['./dialogo-confirmar.component.scss']
})
export class DialogoConfirmarComponent {

  public retorno: string="0";
  public mensaje: string="";
  public texto: string="";
  public textBoton1 : string ="";
  public textBoton2 : string ="";

  constructor(public hostElement: ElementRef, public dialogRef: MatDialogRef<DialogoConfirmarComponent>) { }

  public v_Confirmar(){
    this.dialogRef.close();
    this.retorno="1";
    
  }

  public v_Cancelar(){
    this.dialogRef.close();
    this.retorno="0";

  }


}
