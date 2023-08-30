import { HttpClient, HttpXhrBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Conexion } from "src/app/SHARED/class/Cadena_Conexion";

@Injectable({
    providedIn: 'root',
  })
export class getServidor{
    
  private _Cnx = new Conexion();
  private http: HttpClient;

  constructor(){

      this.http = new HttpClient(new HttpXhrBackend({ 
          build: () => new XMLHttpRequest() 
      }));

  }

  public FechaServidor(user : string) : Observable<any>{
    return this.http.get<any>(this._Cnx.Url() + "SIS/FechaServidor?user="+ user);
 }
  
 public Login(user: string, pass : string) : Observable<any>{
  return this.http.get<any>(this._Cnx.Url() + "SIS/Login?user=" + user + "&pass=" + pass);
}

 

}