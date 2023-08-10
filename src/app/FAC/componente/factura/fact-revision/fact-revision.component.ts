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
  private MonedaCliente : string;
  private TipoExoneracion : string;

  constructor(public cFunciones: Funciones){}


  public Iniciar(lst : iDetalleFactura[], TC : number, MonedaCliente :string, TipoExoneracion : string)
  {
    this.lstDetalle = lst;
    this.TC = TC;
    this.MonedaCliente = MonedaCliente;
    this.TipoExoneracion = TipoExoneracion;
    this.Calcular();
  }

  public v_Eliminar(index : number): void {

    let i : number = this.lstDetalle.findIndex(f=> f.IndexUnion == index && f.EsBonif);
    if(i != -1)this.lstDetalle.splice(i, 1);

    i =  this.lstDetalle.findIndex(f=> f.Index == index && !f.EsBonif);
    if(i != -1)this.lstDetalle.splice(i, 1);


    this.Calcular();

  }


  private Calcular() :void{

    this.SubTotal = 0;
    this.Descuento = 0;
    this.SubTotalNeto = 0;
    this.Impuesto = 0;
    this.TotalCordoba = 0;
    this.TotalDolar = 0;
   
    if (this.TC == 0) this.TC = 1;

    this.lstDetalle.forEach(f =>{

      let Precio : number = this.MonedaCliente == this.cFunciones.MonedaLocal ? f.PrecioCordoba : f.PrecioDolar;

      if (this.cFunciones.MonedaLocal == this.MonedaCliente)
      {
        f.PrecioCordoba = Precio;
        f.PrecioDolar = this.cFunciones.Redondeo(f.PrecioCordoba / this.TC, "4");
      }
      else
      {
        f.PrecioDolar = Precio;
        f.PrecioCordoba = this.cFunciones.Redondeo(f.PrecioCordoba * this.TC, "4");
      }

      
    let PrecioCordoba: number = f.PrecioCordoba;
    let PrecioDolar: number = f.PrecioDolar;
    let Cantidad: number = f.Cantidad;
    let PorDescuento: number = f.PorcDescuento;
    let PorcImpuesto: number = f.PorcImpuesto;
 

    f.ImpuestoExo = 0;
    f.ImpuestoExoCordoba = 0;
    f.ImpuestoExoDolar = 0;
    f.EsExonerado = false;

    

    if (this.cFunciones.MonedaLocal == this.MonedaCliente) {
      f.SubTotal = this.cFunciones.Redondeo(PrecioCordoba * Cantidad, "2");
      f.Descuento = this.cFunciones.Redondeo(f.SubTotal * PorDescuento, "2");
      f.SubTotalNeto = this.cFunciones.Redondeo(f.SubTotal - f.Descuento, "2");
      f.Impuesto = this.cFunciones.Redondeo(f.SubTotalNeto * PorcImpuesto,"2");
      f.ImpuestoCordoba = f.Impuesto;
      f.ImpuestoDolar = this.cFunciones.Redondeo(f.ImpuestoCordoba / this.TC,"2");


      if(this.TipoExoneracion == "Exonerado")
      {
        f.ImpuestoExo = f.Impuesto;
        f.ImpuestoExoCordoba = f.ImpuestoCordoba;
        f.ImpuestoExoDolar = f.ImpuestoDolar;
        f.EsExonerado = true;

        f.Impuesto = 0;
        f.ImpuestoCordoba = 0;
        f.ImpuestoDolar = 0;
      }

      f.TotalCordoba = this.cFunciones.Redondeo(f.SubTotalNeto + f.Impuesto, "2");
      f.TotalDolar = this.cFunciones.Redondeo(f.TotalCordoba / this.TC,"2");
      
    } 
    else {
      f.SubTotal = this.cFunciones.Redondeo(PrecioDolar * Cantidad, "2");
      f.Descuento = this.cFunciones.Redondeo(f.SubTotal * PorDescuento,"2");
      f.SubTotalNeto = this.cFunciones.Redondeo(f.SubTotal - f.Descuento, "2");
      f.Impuesto = this.cFunciones.Redondeo(f.SubTotalNeto * PorcImpuesto,"2");
      f.ImpuestoDolar = f.Impuesto;
      f.ImpuestoCordoba = this.cFunciones.Redondeo(f.ImpuestoCordoba * this.TC,"2");

      if(this.TipoExoneracion == "Exonerado")
      {
        f.ImpuestoExo = f.Impuesto;
        f.ImpuestoExoCordoba = f.ImpuestoCordoba;
        f.ImpuestoExoDolar = f.ImpuestoDolar;
        f.EsExonerado = true;

        f.Impuesto = 0;
        f.ImpuestoCordoba = 0;
        f.ImpuestoDolar = 0;
      }


      f.TotalDolar = this.cFunciones.Redondeo(f.SubTotalNeto + f.Impuesto, "2");
      f.TotalCordoba = this.cFunciones.Redondeo(f.TotalDolar * this.TC,"2");
    }


  

      this.SubTotal += this.cFunciones.Redondeo(f.SubTotal, "2");
      this.Descuento += this.cFunciones.Redondeo(f.Descuento, "2");
      this.SubTotalNeto += this.cFunciones.Redondeo(f.SubTotalNeto, "2");
      this.Impuesto += this.cFunciones.Redondeo(f.Impuesto, "2");
      this.TotalCordoba += this.cFunciones.Redondeo(f.TotalCordoba, "2");
      this.TotalDolar += this.cFunciones.Redondeo(f.TotalDolar, "2");


    });

  }
}
