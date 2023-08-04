import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Funciones {
  private _FechaServidor: Date = new Date();

  private datePipe: DatePipe = new DatePipe('en-US');

  constructor() {
    this._FechaServidor = new Date(
      this.DateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
    );
  }

  public FechaServidor(): Date {
    return this._FechaServidor;
  }

  public DateAddDay(Tipo: string, Fecha: Date, Num: number): string {
    switch (Tipo) {
      case 'Day':
        return this.DateFormat(new Date(Number(Fecha) + Num), 'yyyy-MM-dd');
        break;

      case 'Month':
        return this.DateFormat(
          new Date(Fecha.setMonth(Fecha.getMonth() + Num)),
          'yyyy-MM-dd'
        );
        break;

      case 'Year':
        return this.DateFormat(
          new Date(Fecha.setFullYear(Fecha.getFullYear() + Num)),
          'yyyy-MM-dd'
        );
        break;
    }

    return this.DateFormat(Fecha, 'yyyy-MM-dd');
  }

  public DateFormat(fecha: Date, formart: string): string {
    return this.datePipe.transform(fecha, formart)!;
  }
}
