import { Component } from '@angular/core';
import { LoginService } from './SHARED/service/login.service';
import { DisableService } from './SHARED/service/disable.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Global Vet';

  public constructor(private _SrvLogin: LoginService, private Disable : DisableService){
    this._SrvLogin.isLogin();

    
  }

  ngOnInit(){


    /*this.Disable.disable_DevTool();
    this.Disable.disable_RightClick();
    this.Disable.disable_Reload();*/
  }
  
}
