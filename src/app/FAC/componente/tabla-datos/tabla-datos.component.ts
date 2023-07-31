import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.scss']
})
export class TablaDatosComponent {

  public Titulo : String = "";
  public Encabezado_1 : String = "";
  public Encabezado_2 : String = "";
  public Encabezado_3 : String = "";

  constructor(
    public dialogRef: MatDialogRef<TablaDatosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[],
  ) {

   
    switch(data[0]){

      case "E":
        this.Titulo = "EXISTENCIA EN BODEGA";
        this.Encabezado_1 = "Codigo";
        this.Encabezado_2 = "Sucursa";
        this.Encabezado_3 = "Existencia";
      break;

      case "B":
        this.Titulo = "BONIFICACIONES PERMITIDAS";
        this.Encabezado_1 = "Escala";
        this.Encabezado_2 = "Bonificado";
        this.Encabezado_3 = "";
      break;

      case "P":
        this.Titulo = "PRECIO AUTORIZADOS";
        this.Encabezado_1 = "Precio";
        this.Encabezado_2 = "C$";
        this.Encabezado_3 = "U$";
      break;

      case "D":
        this.Titulo = "DESCUENTO AUTORIZADO";
        this.Encabezado_1 = "Descuento";
        this.Encabezado_2 = "%";
        this.Encabezado_3 = "";
      break;
    }

  }

}
