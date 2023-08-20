import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { getFactura } from 'src/app/FAC/GET/get-factura';
import { iFactPed } from 'src/app/FAC/interface/i-Factura-Pedido';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
  selector: 'app-registro-factura',
  templateUrl: './registro-factura.component.html',
  styleUrls: ['./registro-factura.component.scss']
})
export class RegistroFacturaComponent {

  public lstDocumentos : iFactPed[];

  constructor(
    private dialog: MatDialog,
    private Conexion: getFactura,
  ) {
    this.CargarDocumentos();
  }

  private CargarDocumentos(): void {

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.Conexion.Get().subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);
     
        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos[] = _json["d"];

          this.lstDocumentos = Datos[0].d;
          
        
        }
      },
      (err) => {
        document.getElementById("btnRefrescar")?.removeAttribute("disabled");
        dialogRef.close();

        this.dialog.open(DialogErrorComponent, {
          data: "<b class='error'>" + err.message + "</b>",
        });
      }
    );
  }


}
