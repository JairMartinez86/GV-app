import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class getFactura{
    
    private _Cnx = new Conexion();
    private http: HttpClient;

    constructor(){

        this.http = new HttpClient(new HttpXhrBackend({ 
            build: () => new XMLHttpRequest() 
        }));

    }

    public DatosSucursal(CodBodega : string) : Observable<string>{
      return this.http.get<any>(this._Cnx.Url() + "Factura/DatosSucursal?CodBodega=" + CodBodega);
   }
    
    public Datos_Factura() : Observable<string>{
       return this.http.get<any>(this._Cnx.Url() + "Factura/Datos");
    }
    
    public Datos_Credito(CodCliente : string) : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/DatosCredito?CodCliente=" + CodCliente);
     }

     public Datos_ClienteClave(CodCliente : string) : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/ClienteClave?CodCliente=" + CodCliente);
     }
     



     public Cargar_Productos() : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/CargarProductos");
     }


     public Datos_Producto(CodProducto : string, CodBodega : string, CodCliente : string) : Observable<string>{
        return this.http.get<any>(this._Cnx.Url() + "Factura/DatosProducto?CodProducto=" + CodProducto + "&CodBodega=" + CodBodega + "&CodCliente=" + CodCliente);
     }
     
     

}