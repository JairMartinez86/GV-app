import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FactDeliveryComponent } from '../fact-delivery/fact-delivery.component';

@Component({
  selector: 'app-fact-confirmar',
  templateUrl: './fact-confirmar.component.html',
  styleUrls: ['./fact-confirmar.component.scss'],
})
export class FactConfirmarComponent {
  public TipoFactura: String = 'Factura';
  public TipoExoneracion: String = 'Sin Exoneración';
  public TipoPago: String = 'Contado';
  public TipoImpuesto: String = 'Iva';

  public constructor(public dialog: MatDialog) {
   
    
  }




  //████████████████████████████████████████████FICHA FACTURA████████████████████████████████████████████████████████████████████████
  public v_TipoPago(event: any): void {
    if (event.target.checked) {
      this.TipoPago = 'Credito';
      return;
    }

    if (!event.target.checked) {
      this.TipoPago = 'Contado';
      return;
    }
  }

  public v_TipoImpuesto(event: any): void {
    if (event.target.checked) {
      this.TipoImpuesto = 'Sin Iva';
      return;
    }

    if (!event.target.checked) {
      this.TipoImpuesto = 'Iva';
      return;
    }
  }

  //████████████████████████████████████████████VER FACTURA████████████████████████████████████████████████████████████████████████

  public v_TipoFactura(event: any): void {
   
    if (event.target.checked) {
      this.TipoFactura = 'Factura';
      return;
    }

    if (!event.target.checked) {
      this.TipoFactura = 'Pedido';
      return;
    }
  }

  public v_TipoExoneracion(event: any): void {
    if (event.target.checked) {
      this.TipoExoneracion = 'Sin Exoneración';
      return;
    }

    if (!event.target.checked) {
      this.TipoExoneracion = 'Exonerado';
      return;
    }
  }



  public v_Delivery(): void {

    const dialogRef: MatDialogRef<FactDeliveryComponent> = this.dialog.open(
      FactDeliveryComponent,
      {
        panelClass: window.innerWidth < 992 ? 'escasan-dialog-full' : '',
        data: '',
      }
    );
  }
}
