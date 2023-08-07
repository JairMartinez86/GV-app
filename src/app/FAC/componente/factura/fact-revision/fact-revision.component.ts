import { Component } from '@angular/core';
import { iDetalleFactura } from 'src/app/FAC/interface/i-detalle-factura';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';

@Component({
  selector: 'app-fact-revision',
  templateUrl: './fact-revision.component.html',
  styleUrls: ['./fact-revision.component.scss'],
})
export class FactRevisionComponent {
  public lstDetalle: iDetalleFactura[] = [];

  public SubTotal: number = 0;
  public Descuento: number = 0;
  public SubTotalNeto: number = 0;
  public Impuesto: number = 0;
  public TotalCordoba: number = 0;
  public TotalDolar: number = 0;
  public TC: number = 0;

  constructor(public cFunciones: Funciones){}


  public Iniciar(lst : iDetalleFactura[], tc : number)
  {
    this.lstDetalle = lst;
    this.TC = tc;
    this.Calcular();
  }

  public v_Eliminar(index : number): void {

    let i : number = this.lstDetalle.findIndex(f=> f.Index == index);
    this.lstDetalle.splice(i, 1);

    this.Calcular();

  }


  private Calcular() :void{

    this.SubTotal = 0;
    this.Descuento = 0;
    this.SubTotalNeto = 0;
    this.Impuesto = 0;
    this.TotalCordoba = 0;
    this.TotalDolar = 0;
   


    this.lstDetalle.forEach(f =>{

      this.SubTotal += this.cFunciones.Redondeo(f.SubTotal, "2");
      this.Descuento += this.cFunciones.Redondeo(f.Descuento, "2");
      this.SubTotalNeto += this.cFunciones.Redondeo(f.SubTotalNeto, "2");
      this.Impuesto += this.cFunciones.Redondeo(f.Impuesto, "2");
      this.TotalCordoba += this.cFunciones.Redondeo(f.TotalCordoba, "2");
      this.TotalDolar += this.cFunciones.Redondeo(f.TotalDolar, "2");


    });

  }
}
