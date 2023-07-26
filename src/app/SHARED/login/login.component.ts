import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  
  public constructor(private _Router: Router){}

  public v_Iniciar(): void{

    this._Router.navigate(['/Menu'], { skipLocationChange: false });

  }

}
