import { DatePipe, formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Funciones {

  private _TiempoDesconexion : number = 0;

  public FechaServer: Date;

  public TiempoDesconexion() : number{
    return this._TiempoDesconexion;
  }
  

  private datePipe: DatePipe = new DatePipe('en-US');

  public MonedaLocal = "C";

  public User : string = "";
  public Nombre : string = "";
  public Rol : string = "";




  public FechaServidor(f  : Date) {
    this.FechaServer = new Date(
      this.DateFormat(f, 'yyyy-MM-dd hh:mm:ss')
    );
  }
  

  public ShortFechaServidor() : string {
    return this.DateFormat(this.FechaServer, 'yyyy-MM-dd')
  }


    
  public SetTiempoDesconexion(n : number) : void{
     this._TiempoDesconexion = n;
  }




  public DateAdd(Tipo: string, Fecha: Date, Num: number): string {
    let f = new Date(Fecha);
    switch (Tipo) {
      case 'Day':
        return this.DateFormat(new Date(f.setDate( f.getDate() + Num)), 'yyyy-MM-dd');
        break;

      case 'Month':
        return this.DateFormat(
          new Date(f.setMonth(f.getMonth() + Num)),
          'yyyy-MM-dd'
        );
        break;

      case 'Year':
        return this.DateFormat(
          new Date(f.setFullYear(f.getFullYear() + Num)),
          'yyyy-MM-dd'
        );
        break;
    }

    return this.DateFormat(f, 'yyyy-MM-dd');
  }

  public DateFormat(fecha: Date, formart: string): string {
    return this.datePipe.transform(fecha, formart)!;
  }



  public NumFormat(valor: number, decimal : string): string {
    return formatNumber(valor, "en-IN",  "1."+decimal+"-"+decimal);
  }


  public Redondeo(valor : number, numDecimal : string) : number{

    valor = Number(valor);
    valor = (Math.round(valor * Math.pow(10, Number(numDecimal))) / Math.pow(10, Number(numDecimal)));

    return  Number(valor);
  }



  public v_Prevent_IsNumber(event : any, tipo : string) : void{

    if(event.key === "Backspace" || event.key === "Enter" || event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key == "ArrowDown" ||
    event.key === "F1" || event.key === "F2" || event.key === "F3" || event.key === "F4" || event.key === "F5" || event.key === "F6" || event.key === "F7" ||
    event.key === "F8" || event.key === "F9" || event.key === "F10" || event.key === "F11" || event.key === "F12") return;

    if(event.key == ",") {
      event.preventDefault();
      return;
    }
    

    if(tipo == "Decimal")
    {
      if((String(event.target.value).includes(".") && event.key == ".")  || ( event.key == "." && event.target.value == "")) {
        event.preventDefault();
        return;
      }
      
      if(String(event.target.value).includes("."))
      {
        let decimal : string[] = String(event.target.value).split(".");
  
        if(isNaN(parseFloat(event.key)) && !isFinite(event.key)){
          event.preventDefault();
          return;
        }
  
      }
    }

    if(tipo == "Entero"){
      if(isNaN(parseFloat(event.key)) && !isFinite(event.key)){
        event.preventDefault();
        return;
      }
    }

   
  }

}


