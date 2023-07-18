import { Component } from '@angular/core';

@Component({
  selector: 'app-fact-revision',
  templateUrl: './fact-revision.component.html',
  styleUrls: ['./fact-revision.component.scss'],
})
export class FactRevisionComponent {



  public v_FichaPanel(Panel: String): void {

    
    (document.querySelector('#frmRevision') as HTMLElement).setAttribute(
      'style',
      'display:none;'
    );

    switch (Panel) {
      case 'Ver Productos':
        (document.querySelector('#frmFichaProducto') as HTMLElement).setAttribute(
          'style',
          'display:initial;'
        );
        break;

      case 'Confirmar':
        (document.querySelector('#frmConfirmarFactura') as HTMLElement).setAttribute(
          'style',
          'display:initial;'
        );
        break;
    }
  }


public v_Eliminar() : void{
  
}
}
