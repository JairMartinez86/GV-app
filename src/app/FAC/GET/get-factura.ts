import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

export class getFactura{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }
    
    public Datos_Factura() : Observable<string>{
       return this.http.get<any>(this._Cnx.Url() + "Factura/Datos")
    }
    

}