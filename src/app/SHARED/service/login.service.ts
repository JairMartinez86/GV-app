import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { iLogin } from '../interface/i-login';
import { Funciones } from '../class/cls_Funciones';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { getServidor } from '../GET/get-servidor';
import { WaitComponent } from '../componente/wait/wait.component';
import { DialogErrorComponent } from '../componente/dialog-error/dialog-error.component';
import { iDatos } from '../interface/i-Datos';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

 

  constructor(private _Router: Router, private cFunciones : Funciones,
    private DIALOG: MatDialog, private GET: getServidor) { }


  public Session(user : string, pwd : string) : void{

    document.getElementById("btnLogin")?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );
    
    this.GET.Login(user, pwd).subscribe(
      {
        next: (data) => {

          
          dialogRef.close();
          let _json: any =  JSON.parse(data);

          if (_json["esError"] == 1) {
            this.DIALOG.open(DialogErrorComponent, {
              data: _json["msj"].Mensaje,
            });
          } else {

            let datos : iDatos[] =  _json["d"];

            let l : iLogin = datos[0].d[0];
            this.cFunciones.User = l.User;
            this.cFunciones.Nombre = l.Nombre;
            this.cFunciones.Rol = l.Rol;
            this.cFunciones.FechaServidor(datos[1].d);
            this.cFunciones.SetTiempoDesconexion(Number(datos[2].d));
            l.FechaServer = datos[1].d;
            l.TimeOut = Number(datos[2].d);
    
              localStorage.removeItem("login");

              if(datos[0].d != undefined)
              {
                localStorage.setItem("login", JSON.stringify(l));

              this.isLogin();
              }

              
          }

        },
        error: (err) => {

          document.getElementById("btnLogin")?.removeAttribute("disabled");

          dialogRef.close();

          if(this.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }

        },
        complete: () => { 
        document.getElementById("btnLogin")?.removeAttribute("disabled");
 
      }
      }
    );


  }

  
  public isLogin(){


    let s : string = localStorage.getItem("login")!;

    if(s != undefined){

      let l : iLogin = JSON.parse(s);

      
    if(this.cFunciones.User == "")
    {
      this.cFunciones.User = l.User;
      this.cFunciones.Nombre = l.Nombre;
      this.cFunciones.Rol = l.Rol;
      this.cFunciones.FechaServidor(new Date(l.FechaServer));
      this.cFunciones.SetTiempoDesconexion(l.TimeOut);
    }


      if(this.Diff(new Date(l.FechaLogin)) <= this.cFunciones.TiempoDesconexion())
      {

        if(this._Router.url !== '/Menu')
        {
          this._Router.navigate(['/Menu'], { skipLocationChange: false });
        }
       
        return;
      }
 
    }

    localStorage.removeItem("login");
    this._Router.navigate(['/Login'], { skipLocationChange: false });
  }


  Diff(FechaLogin : Date){

    let FechaServidor : Date = new Date(this.cFunciones.FechaServer);

    var Segundos = Math.abs((FechaLogin.getTime() - FechaServidor.getTime()) / 1000);
    return Segundos;
  }


  public UpdFecha(f : string){

    let s : string = localStorage.getItem("login")!;
   
   if(s != undefined){

      let l : iLogin = JSON.parse(s);
      l.FechaLogin = f;
      localStorage.removeItem("login");
      localStorage.setItem("login", JSON.stringify(l));

      this.isLogin();
    }

  }

  public CerrarSession(){
    localStorage.removeItem("login");
    this._Router.navigate(['/Login'], { skipLocationChange: false });
  }

  
}
