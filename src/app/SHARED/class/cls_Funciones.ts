import { DatePipe, formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})
export class Funciones {

  private _TiempoDesconexion: number = 0;

  public FechaServer: Date;

  public TiempoDesconexion(): number {
    console.log(this._TiempoDesconexion)
    return this._TiempoDesconexion;
  }


  private datePipe: DatePipe = new DatePipe('en-US');

  public MonedaLocal = "C";

  public User: string = "";
  public Nombre: string = "";
  public Rol: string = "";

  constructor(public DIALOG: MatDialog) {

  }





  public FechaServidor(f: Date) {
    this.FechaServer = new Date(
      this.DateFormat(f, 'yyyy-MM-dd hh:mm:ss')
    );
  }


  public ShortFechaServidor(): string {
    return this.DateFormat(this.FechaServer, 'yyyy-MM-dd')
  }



  public SetTiempoDesconexion(n: number): void {
    this._TiempoDesconexion = n;
  }




  public DateAdd(Tipo: string, Fecha: Date, Num: number): string {
    let f = new Date(Fecha);
    switch (Tipo) {
      case 'Day':
        return this.DateFormat(new Date(f.setDate(f.getDate() + Num)), 'yyyy-MM-dd');
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

  public LastDay(Fecha: Date): string {
    let f = new Date(Fecha.getFullYear(), Fecha.getMonth() + 1);

    return this.DateFormat(f, 'yyyy-MM-dd');
  }

  public DateFormat(fecha: Date, formart: string): string {
    return this.datePipe.transform(fecha, formart)!;
  }



  public NumFormat(valor: number, decimal: string): string {
    return formatNumber(valor, "en-IN", "1." + decimal + "-" + decimal);
  }


  public Redondeo(valor: number, numDecimal: string): number {

    valor = Number(valor);
    valor = (Math.round(valor * Math.pow(10, Number(numDecimal))) / Math.pow(10, Number(numDecimal)));

    return Number(valor);
  }



  public v_Prevent_IsNumber(event: any, tipo: string): void {

    if (event.key === "Backspace" || event.key === "Enter" || event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key == "ArrowDown" ||
      event.key === "F1" || event.key === "F2" || event.key === "F3" || event.key === "F4" || event.key === "F5" || event.key === "F6" || event.key === "F7" ||
      event.key === "F8" || event.key === "F9" || event.key === "F10" || event.key === "F11" || event.key === "F12") return;

    if (event.key == ",") {
      event.preventDefault();
      return;
    }


    if (tipo == "Decimal") {
      if ((String(event.target.value).includes(".") && event.key == ".") || (event.key == "." && event.target.value == "")) {
        event.preventDefault();
        return;
      }

      if (String(event.target.value).includes(".")) {
        let decimal: string[] = String(event.target.value).split(".");

        if (isNaN(parseFloat(event.key)) && !isFinite(event.key)) {
          event.preventDefault();
          return;
        }

      }
      else {

        if (event.key != "." && (String(event.target.value) == "" && !isFinite(event.key) || String(event.target.value) != "" && isNaN(parseFloat(event.key)))) {
          event.preventDefault();
          return;
        }



      }



    }

    if (tipo == "Entero") {
      if (isNaN(parseFloat(event.key)) && !isFinite(event.key)) {
        event.preventDefault();
        return;
      }
    }


  }


  public MyBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!(document as any).documentMode == true)) {
      return 'IE';
    } else {
      return 'unknown';
    }
  }


  getBrowserVersion() {
    var userAgent = navigator.userAgent, tem,
      matchTest = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    matchTest = matchTest[2] ? [matchTest[1], matchTest[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }


}
