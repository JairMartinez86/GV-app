import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TablaDatosComponent } from '../tabla-datos/tabla-datos.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { getFactura } from '../../GET/get-factura';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iCliente } from '../../interface/i-Cliente';
import {
  ConnectedPositioningStrategy,
  GlobalPositionStrategy,
  HorizontalAlignment,
  IgxComboComponent,
  OverlaySettings,
  PositionSettings,
  VerticalAlignment,
  scaleInCenter,
  scaleOutCenter,
} from 'igniteui-angular';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent {
  public val = new Validacion();

  lstClientes: iCliente[] = [];
  filteredClientes: Observable<iCliente[]> | undefined;

  public Panel: String = '';
  public BotonSiguienteLabel = '';

  public TipoPago: String = 'Contado';
  public TipoImpuesto: String = 'Iva';
  public EsContraEntrega: Boolean = false;
  public EsExportacion: Boolean = false;

  public CodCliente : string = "";

  public SimboloMonedaCliente: String = 'C$';

  constructor(public dialog: MatDialog) {
    this.val.add(
      'txtCliente',
      '1',
      'LEN>',
      '0',
      'Cliente',
      'Seleccione un cliente.'
    );

    this.CargarDatos();
  }

  private CargarDatos(): void {
    let Conexion: getFactura = new getFactura();

    Conexion.Datos_Factura().subscribe(
      (s) => {
        let _json = JSON.parse(s);

        if (_json['esError'] == 1) {
          let dialogRef: MatDialogRef<DialogErrorComponent> = this.dialog.open(
            DialogErrorComponent,
            {
              data: _json['msj'],
            }
          );
        } else {
          let Datos: iDatos[] = _json['d'];

          this.lstClientes = Datos[0].d;
        }
      },
      (err) => {}
    );
  }

  //████████████████████████████████████████████DATOS CLIENTE████████████████████████████████████████████████████████████████████████

  public v_Select_Cliente(event: any): void {
    let Cliente : iCliente[] = this.lstClientes.filter( f => f.Key == event.option.value);

    this.CodCliente = "";
    this.val.Get("txtCliente").setValue("");
    if(Cliente.length > 0){
      this.CodCliente = Cliente[0].Codigo;
      this.val.Get("txtCliente").setValue(Cliente[0].Cliente);
      this.val.Get("txtCliente").disable();
    }
  }

  public v_Borrar_Cliente() : void{
    this.CodCliente = "";
    this.val.Get("txtCliente").setValue("");
    this.val.Get("txtCliente").enable();
  }

  /*
 @ViewChild('cmbCliente', { static: false })
 public cmbCliente: IgxComboComponent;
 

 public v_Select_Cliente(event: any) {
  if (event.added.length) {
      event.newSelection = event.added;
      let _Fila : any =  this.lstClientes.find(f => f.Codigo == event.added)
  }

  this.cmbCliente.close();
}

public v_Enter_Cliente(event : any) {
 
  if(event.key == "Enter"){
    let _Item : iCliente =this.cmbCliente.dropdown.focusedItem.value
    this.cmbCliente.setSelectedItem(_Item.Codigo);
  }

}

public v_Close_Cliente(){
 // this.f_key_Enter(this.igxCombo.id);
}


public customSettings: OverlaySettings = {
  positionStrategy: new GlobalPositionStrategy(
      {
          openAnimation: scaleInCenter,
          closeAnimation: scaleOutCenter,
      }),
  modal: true,
  closeOnOutsideClick: true,
};

*/

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

  public v_FichaPanel(evento: String): void {
    (document.querySelector('#frmFichaFactura') as HTMLElement).setAttribute(
      'style',
      'display:none;'
    );

    (document.querySelector('#frmFichaProducto') as HTMLElement).setAttribute(
      'style',
      'display:none;'
    );

    (document.querySelector('#frmRevision') as HTMLElement).setAttribute(
      'style',
      'display:none;'
    );

    (
      document.querySelector('#frmConfirmarFactura') as HTMLElement
    ).setAttribute('style', 'display:none;');

    if (
      (evento == 'Siguiente' && this.Panel == '') ||
      (evento == 'Atras' && this.Panel == 'Revision')
    ) {
      this.Panel = 'Producto';
      this.BotonSiguienteLabel = 'Ver Producto';

      (document.querySelector('#frmFichaProducto') as HTMLElement).setAttribute(
        'style',
        'display:initial;'
      );

      return;
    }

    if (evento == 'Atras' && this.Panel == 'Producto') {
      this.Panel = '';
      this.BotonSiguienteLabel = '';

      (document.querySelector('#frmFichaFactura') as HTMLElement).setAttribute(
        'style',
        'display:initial;'
      );
      return;
    }

    if (
      (evento == 'Siguiente' && this.Panel == 'Producto') ||
      (evento == 'Atras' && this.Panel == 'Confirmar')
    ) {
      this.Panel = 'Revision';
      this.BotonSiguienteLabel = 'Confirmar';

      (document.querySelector('#frmRevision') as HTMLElement).setAttribute(
        'style',
        'display:initial;'
      );
      return;
    }

    if (evento == 'Siguiente' && this.Panel == 'Revision') {
      this.Panel = 'Confirmar';
      this.BotonSiguienteLabel = 'Facturar';

      (
        document.querySelector('#frmConfirmarFactura') as HTMLElement
      ).setAttribute('style', 'display:initial;');
      return;
    }

    if (evento == 'Siguiente' && this.Panel == 'Confirmar') {
      this.Panel = 'Confirmar';
      this.BotonSiguienteLabel = 'Facturar';

      (
        document.querySelector('#frmConfirmarFactura') as HTMLElement
      ).setAttribute('style', 'display:initial;');

      let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
        WaitComponent,
        {
          panelClass: 'escasan-dialog-full-blur',
          data: '',
        }
      );

      return;
    }
  }

  public v_Datos_Producto(p: String): void {
    let dialogRef: MatDialogRef<TablaDatosComponent> = this.dialog.open(
      TablaDatosComponent,
      {
        panelClass: window.innerWidth < 992 ? 'escasan-dialog-full' : '',
        data: [p, ''],
      }
    );

    /*dialogRef.afterOpened().subscribe(s =>{
      alert("")
      dialogRef.componentInstance.VisibleCol3 = true;
    });*/
  }

  ngOnInit() {
    //FILTRO CLIENTE
    this.filteredClientes = this.val.Get('txtCliente').valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        return this.lstClientes.filter((option) =>
          option.Key.toLowerCase().includes(
            (value || '').toLowerCase().trimStart()
          )
        );
      })
    );
  }

  ngAfterViewInit() {
    //HABILITANDO CHECKBOK POR PROBLEMAS DE VIZUALIZACION
    const lstcheckbox: any = document.querySelectorAll(
      "input[type='checkbox']"
    );
    lstcheckbox.forEach((f: any) => {
      if (f.id != 'chkDelivery') {
        f.bootstrapToggle();
      }
    });
  }
}
