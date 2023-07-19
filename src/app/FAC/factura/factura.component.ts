import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TablaDatosComponent } from '../tabla-datos/tabla-datos.component';
import { FactDeliveryComponent } from '../fact-delivery/fact-delivery.component';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent {
  myControl = new FormControl('');
  options: string[] = ['Uno', 'Dos', 'Tres'];
  filteredOptions: Observable<string[]> | undefined;

  
  public TipoPago: String = 'Contado';
  public TipoImpuesto: String = 'Iva';
  public EsContraEntrega : Boolean = false;
  public EsExportacion : Boolean = false;
  
  public SimboloMonedaCliente: String = 'C$';

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
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

  public v_ContraEntrega(event: any): void {

    this.EsContraEntrega = event.target.checked;
  }

  
  public v_Exportacion(event: any): void {

    this.EsExportacion = event.target.checked;
  }

  //████████████████████████████████████████████FICHA PRODUCTO████████████████████████████████████████████████████████████████████████

  public v_FichaPanel(Panel: String): void {
    (document.querySelector('#frmFichaFactura') as HTMLElement).setAttribute(
      'style',
      'display:none;'
    );

    (
      document.querySelector('#frmFichaProducto') as HTMLElement
    ).setAttribute('style', 'display:initial;');

   
  }

  public v_Datos_Producto(p: String): void {
    let dialogRef: MatDialogRef<TablaDatosComponent> = this.dialog.open(
      TablaDatosComponent,
      {
        panelClass: (window.innerWidth < 992 ? "escasan-dialog-full" : ""),
        data: [p, ""],
      }
    );

    /*dialogRef.afterOpened().subscribe(s =>{
      alert("")
      dialogRef.componentInstance.VisibleCol3 = true;
    });*/
  }

}
