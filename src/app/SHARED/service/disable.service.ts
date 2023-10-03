import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import DisableDevtool from 'disable-devtool';

@Injectable({
    providedIn: 'root',
})
export class DisableService {
    constructor(@Inject(DOCUMENT) private document: Document) { }
    disable_RightClick() {
        this.document.addEventListener('contextmenu', (event) =>
            event.preventDefault()
        );
    }


    disable_DevTool()
    {
        DisableDevtool();
    }


    disable_Reload() {
        window.addEventListener("keyup", disableF5);
        window.addEventListener("keydown", disableF5);
        
   
       function disableF5(e : any) {
   
          if ((e.which || e.keyCode) == 116) e.preventDefault(); 
   
       };

   

       window.addEventListener("beforeunload", event => {

        event.preventDefault()
        // Chrome requires returnValue to be set.
        event.returnValue = ""
      })

       
    }





}
