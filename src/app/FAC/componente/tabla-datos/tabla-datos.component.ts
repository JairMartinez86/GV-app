import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iExistencia } from '../../interface/i-Existencia';
import { iBonificacion } from '../../interface/i-Bonificacion';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { iPrecio } from '../../interface/i-Precio';

export interface iTabla{
  col1: any;
  col2: any;
  col3: any;
  EsPrincipal : boolean;
}


@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.scss']
})
export class TablaDatosComponent {

  public lstDetalle : iTabla[] = [];

  public Titulo : String = "";
  public Encabezado_1 : String = "";
  public Encabezado_2 : String = "";
  public Encabezado_3 : String = "";

  constructor( private cFunciones : Funciones,
    public dialogRef: MatDialogRef<TablaDatosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
  ) {

   
    switch(data[0]){

      case "E":
        this.Titulo = "EXISTENCIA EN BODEGA";
        this.Encabezado_1 = "Bodega";
        this.Encabezado_2 = "Existencia";
        this.Encabezado_3 = "";

        let lstExistencia : iExistencia[] = data[1];

        lstExistencia.forEach(f =>{
          this.lstDetalle.push({col1 : f.Bodega, col2 : this.cFunciones.NumFormat(f.Existencia, "0"), col3 : "", EsPrincipal : f.EsPrincipal});
        });


      break;

      case "B":
        this.Titulo = "BONIFICACIONES PERMITIDAS";
        this.Encabezado_1 = "Descripcion";
        this.Encabezado_2 = "Escala";
        this.Encabezado_3 = "";

       
        let lstBonificacion : iBonificacion[] = data[1];

        lstBonificacion.forEach(f =>{
          this.lstDetalle.push({col1 : f.Descripcion, col2 : f.Escala, col3 : "", EsPrincipal : false});
        });

      break;

      case "P":
        this.Titulo = "PRECIO AUTORIZADOS";
        this.Encabezado_1 = "Precio";
        this.Encabezado_2 = "C$";
        this.Encabezado_3 = "U$";

        let lstPrecios : iPrecio[] = data[1];

        lstPrecios.forEach(f =>{
          this.lstDetalle.push({col1 : f.Tipo, col2 : this.cFunciones.NumFormat(f.PrecioCordoba, "4"), col3 : this.cFunciones.NumFormat(f.PrecioDolar, "4"), EsPrincipal : f.EsPrincipal});
        });

      
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
