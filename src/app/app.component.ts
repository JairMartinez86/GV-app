import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Global Vet';

  public constructor(private _Router: Router){

   this._Router.navigate(['/Login'], { skipLocationChange: false });
  
  }
}
