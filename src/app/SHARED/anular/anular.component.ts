import { Component } from '@angular/core';
import { Validacion } from '../class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from '../componente/dialog-error/dialog-error.component';
import { postFactura } from 'src/app/FAC/POST/post-factura';
import { iDatos } from '../interface/i-Datos';
import { WaitComponent } from '../componente/wait/wait.component';

@Component({
  selector: 'app-anular',
  templateUrl: './anular.component.html',
  styleUrls: ['./anular.component.scss']
})
export class AnularComponent {

  public val = new Validacion();
  public IdDoc: string;
  public Tipo: string;

  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<AnularComponent>,
    private POST: postFactura){

    this.val.add("txtNoDoc", "1", "LEN>", "0", "No Documento", "Error con el número del documento.");
    this.val.add("txtSerie", "1", "LEN>", "0", "Serie", "Error con la serie del documento.");
    this.val.add("txtBodega", "1", "LEN>=", "0", "Bodega", "");
    this.val.add("txtFecha", "1", "LEN>=", "0", "Fecha", "");
    this.val.add("txtMotivo", "1", "LEN>", "0", "Motivo", "Ingrese un motivo.");
    
    this.val.Get("txtNoDoc").disable()
    this.val.Get("txtSerie").disable()
    this.val.Get("txtBodega").disable()
    this.val.Get("txtFecha").disable()

  }
  

  
  public v_Aceptar() :void{

    this.val.EsValido();
   
    if(this.val.Errores != "")
    {
      this.dialog.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }


    document.getElementById("btnAnular")?.setAttribute("disabled", "disabled");
    document.getElementById("btnCancelarAnular")?.setAttribute("disabled", "disabled");
    
    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );
    

    this.POST.AnularFactura(this.IdDoc, this.val.Get("txtMotivo").value, "jmg").subscribe(
      (s) => {
   
        document.getElementById("btnAnular")?.removeAttribute("disabled");
        document.getElementById("btnCancelarAnular")?.removeAttribute("disabled");

        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } 
        else {

          this.dialogRef.close();
 
        }
      },
      (err) => {

        document.getElementById("btnAnular")?.removeAttribute("disabled");
        document.getElementById("btnCancelarAnular")?.removeAttribute("disabled");

        
        dialogRef.close();
      
        this.dialog.open(DialogErrorComponent, {
          data: "<b class='error'>" + err.message + "</b>",
        });
      }
    );
    
    
    
  }

  public v_Cancelar() :void{
    this.dialogRef.close();
  }
  

}
