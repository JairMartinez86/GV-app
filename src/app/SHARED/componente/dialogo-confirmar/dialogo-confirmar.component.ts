import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialogo-confirmar',
  templateUrl: './dialogo-confirmar.component.html',
  styleUrls: ['./dialogo-confirmar.component.scss']
})
export class DialogoConfirmarComponent {

  @ViewChild("msj", { static: false })
  public msj: HTMLElement;
  
  public retorno: string="0";
  public mensaje: any;
  public textBoton1 : string ="";
  public textBoton2 : string ="";
  public MostrarCerrar : boolean = false;

  constructor(private sanitizer: DomSanitizer, public hostElement: ElementRef, public dialogRef: MatDialogRef<DialogoConfirmarComponent>) { }

  public v_Confirmar(){
    this.dialogRef.close();
    this.retorno="1";
    
  }



  public v_Cancelar(){
    this.dialogRef.close();
    this.retorno="0";

  }

  public V_Cerrar(){
    this.dialogRef.close();
    this.retorno="-1";
    
  }
  
  public Set_StyleBtn1(style : string)
  {
    document.getElementById("btn-confirmar-1-escasan-dialog")?.setAttribute("style", style);
  }

  public Set_StyleBtn2(style : string)
  {
    document.getElementById("btn-confirmar-2-escasan-dialog")?.setAttribute("style", style);
  }
  
  
  public SetMensajeHtml(mensaje : string)
  {

    document.getElementById("msj-confirmar")?.removeAttribute("class");
    this.mensaje = this.sanitizer.bypassSecurityTrustHtml(mensaje);
  }


}
