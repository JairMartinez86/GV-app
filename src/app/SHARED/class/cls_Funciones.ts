import { DatePipe } from "@angular/common";

export class Funciones{

    private datePipe: DatePipe = new DatePipe("en-US");


    public DateFormat(fecha : Date, formart : string) : string{

        return this.datePipe.transform(fecha, formart)!;
    }
}