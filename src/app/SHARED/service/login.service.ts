import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { iLogin } from '../interface/i-login';
import { Funciones } from '../class/cls_Funciones';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  

  constructor(private _Router: Router, private cFunciones : Funciones) { }


  public Session(user : string, pwd : string) : void{


    let l : iLogin = {} as iLogin;

    l.User = user;
    l.Pwd = pwd;
    l.Fecha = this.cFunciones.DateFormat(new Date(), "yyyy/MM/dd hh:mm:ss");

    localStorage.removeItem("login");
    localStorage.setItem("login", JSON.stringify(l));

    this.isLogin();
  }

  subscription: Subscription = {} as Subscription;
  
  public isLogin(){

    let s : string = localStorage.getItem("login")!;

    if(s != undefined){

      let l : iLogin = JSON.parse(s);
      if(this.Diff(new Date(l.Fecha)) <= 120)
      {
        this.subscription = interval(5000).subscribe(val => this.UpdFecha())
        this._Router.navigate(['/Menu'], { skipLocationChange: false });
        return;
      }
 
    }

    localStorage.removeItem("login");
    this._Router.navigate(['/Login'], { skipLocationChange: false });
  }


  Diff(FechaLogin : Date){

    let FechaServidor : Date = new Date(this.cFunciones.FechaServidor());

    var Segundos = Math.abs((FechaLogin.getTime() - FechaServidor.getTime()) / 1000);
    return Segundos;
  }


  private UpdFecha(){
    
    let s : string = localStorage.getItem("login")!;
   
   if(s != undefined){

      let l : iLogin = JSON.parse(s);
      l.Fecha = this.cFunciones.DateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
      localStorage.removeItem("login");
      localStorage.setItem("login", JSON.stringify(l));
    }

  }

  public CerrarSession(){
    localStorage.removeItem("login");
    this._Router.navigate(['/Login'], { skipLocationChange: false });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
