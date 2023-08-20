import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";
import { iFactPed } from "../interface/i-Factura-Pedido";

@Injectable({
    providedIn: 'root',
  })
export class postFactura{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    GuardarFactura(d : iFactPed) : Observable<string> { 
        return this.http.post<any>(this._Cnx.Url() + "Factura/Guardar", JSON.stringify(d), { headers: { 'content-type': 'application/json' } });

    }

}