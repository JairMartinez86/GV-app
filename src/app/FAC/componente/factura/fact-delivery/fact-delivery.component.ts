import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, startWith } from 'rxjs';
import { iDireccion } from 'src/app/FAC/interface/i-Direccion';
import { Validacion } from 'src/app/SHARED/class/validacion';


@Component({
  selector: 'app-fact-delivery',
  templateUrl: './fact-delivery.component.html',
  styleUrls: ['./fact-delivery.component.scss']
})
export class FactDeliveryComponent {

  public val = new Validacion();
  private lstDirecciones: iDireccion[] = [];
  public lstFilter: iDireccion[] = [];
  public Direccion : string = "";
  

  constructor(
    public dialogRef: MatDialogRef<FactDeliveryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){

    this.val.add("txtDireccion", "1", "LEN>=", "0", "Direccion", "");

    this.Direccion = "";
    this.lstDirecciones = data.map((obj : any) => ({...obj}));

    this.lstFilter = data.map((obj : any) => ({...obj}));



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
  

  public v_Filtrar(event : any){

    this.lstFilter.splice(0, this.lstFilter.length);
    let value = event.target.value;
 
    console.log(event.target.value)
    
    this.lstDirecciones.filter(f => f.Filtro.toLowerCase().includes(value)).forEach(f =>{
      this.lstFilter.push(f);
    });
    

  }


}
