import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iDireccion } from 'src/app/FAC/interface/i-Direccion';


@Component({
  selector: 'app-fact-delivery',
  templateUrl: './fact-delivery.component.html',
  styleUrls: ['./fact-delivery.component.scss']
})
export class FactDeliveryComponent {

  public lstDirecciones: iDireccion[] = [];
  public Direccion : string = "";

  constructor(
    public dialogRef: MatDialogRef<FactDeliveryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){

    this.Direccion = "";
    this.lstDirecciones = data;

    let det = this.lstDirecciones.find(f => f.Seleccionar);
    if(det != undefined)  this.Direccion = det.Direccion;



  }

  public v_Seleccionar(det : iDireccion): void{

    this.Direccion = "";
    if(det.Seleccionar)  this.Direccion = det.Direccion;

    this.lstDirecciones.forEach(f =>{
      if(det.index != f.index)f.Seleccionar = false;
    });
  }

  public v_Aceptar() :void{
    this.dialogRef.close();
  }

  public v_Cancelar() :void{
    this.Direccion = "";
    this.dialogRef.close();
  }


}
