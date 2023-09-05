import { Component } from '@angular/core';
import { Validacion } from '../class/validacion';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogErrorComponent } from '../componente/dialog-error/dialog-error.component';
import { postFactura } from 'src/app/FAC/POST/post-factura';
import { iDatos } from '../interface/i-Datos';
import { WaitComponent } from '../componente/wait/wait.component';
import { Funciones } from '../class/cls_Funciones';

@Component({
  selector: 'app-anular',
  templateUrl: './anular.component.html',
  styleUrls: ['./anular.component.scss']
})
export class AnularComponent {

  public val = new Validacion();
  public IdDoc: string;
  public Tipo: string;

  constructor(public dialogRef: MatDialogRef<AnularComponent>,
    private POST: postFactura, public cFunciones: Funciones) {

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



  public v_Aceptar(): void {

    this.val.EsValido();

 
    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }


    document.getElementById("btnAnular")?.setAttribute("disabled", "disabled");
    document.getElementById("btnCancelarAnular")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );



    this.POST.AnularFactura(this.IdDoc, this.val.Get("txtMotivo").value, this.cFunciones.User).subscribe(
      {
        next: (s) => {

          document.getElementById("btnAnular")?.removeAttribute("disabled");
          document.getElementById("btnCancelarAnular")?.removeAttribute("disabled");
  
          dialogRef.close();
          let _json = JSON.parse(s);
  
          if (_json["esError"] == 1) {
            if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          }
          else {
  
            let Datos: iDatos[] = _json["d"];
  

           let confirm =  this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: Datos[0].d,
            });

            confirm.afterClosed().subscribe(s =>{
              this.dialogRef.close();
            })

            
  
          }

        },
        error: (err) => {

          document.getElementById("btnAnular")?.removeAttribute("disabled");
          document.getElementById("btnCancelarAnular")?.removeAttribute("disabled");
  
  
          dialogRef.close();
  
          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {

        }
      }
    );





  }

  public v_Cancelar(): void {
    this.dialogRef.close();
  }


}
