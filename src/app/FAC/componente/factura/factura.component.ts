import { Component } from '@angular/core';
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

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent {

  public val = new Validacion();

  lstClientes: iCliente[] = [];
  filteredClientes: Observable<iCliente[]> | undefined;

  public Panel: String = "";
  public BotonSiguienteLabel = "";

  public TipoPago: String = 'Contado';
  public TipoImpuesto: String = 'Iva';
  public EsContraEntrega: Boolean = false;
  public EsExportacion: Boolean = false;

  public SimboloMonedaCliente: String = 'C$';

  constructor(public dialog: MatDialog) {

    this.val.add("txtCliente", "1", "LEN>", "0", "Cliente", "Seleccione un cliente.");

    this.CargarDatos();
  }


  private CargarDatos(): void{

    let Conexion : getFactura = new getFactura();

    Conexion.Datos_Factura().subscribe(
      
      s =>{
        let _json = JSON.parse(s);
   
        if(_json["esError"] == 1){

          let dialogRef: MatDialogRef<DialogErrorComponent> = this.dialog.open(
            DialogErrorComponent,
            {
              data: _json["msj"],
            }
          );
        }
        else{
          let Datos : iDatos[] = _json["d"];

          this.lstClientes = Datos[0].d;

        }

        
      },
      err =>{
        
      }
      );

 
  }

  
 //████████████████████████████████████████████DATOS CLIENTE████████████████████████████████████████████████████████████████████████


  private _filter(value: string): iCliente[] {
    const filterValue = value.toLowerCase();

    return this.lstClientes.filter((option) =>
      option.Key.toLowerCase().includes(filterValue)
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

    
    (document.querySelector('#frmConfirmarFactura') as HTMLElement).setAttribute(
      'style',
      'display:none;'
    );


    if (evento == 'Siguiente' && this.Panel == ''   || evento == 'Atras' && this.Panel == 'Revision') {
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


    if (evento == 'Siguiente' && this.Panel == 'Producto' || evento == 'Atras' && this.Panel == 'Confirmar') {
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

      (document.querySelector('#frmConfirmarFactura') as HTMLElement).setAttribute(
        'style',
        'display:initial;'
      );
      return;
    }

    if (evento == 'Siguiente' && this.Panel == 'Confirmar') {
      this.Panel = 'Confirmar';
      this.BotonSiguienteLabel = 'Facturar';

      (document.querySelector('#frmConfirmarFactura') as HTMLElement).setAttribute(
        'style',
        'display:initial;'
      );
     
        let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
          WaitComponent,
          {
            panelClass: "escasan-dialog-full-blur",
            data: ""
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

    /*
    this.filteredClientes = this.val.Get("txtCliente").valueChanges.pipe(
      startWith(''),
      map((value : iCliente) => (typeof value.Cliente === 'string' ? value : value?.Cliente)),
      map((c : iCliente) =>
        c
          ? this.lstClientes.filter(
              (f) =>{
                f.Cliente.toLowerCase().includes(c.Cliente.toLowerCase())
              }
              
            )
          : this.lstClientes.slice()
      )
    );*/
    

    this.filteredClientes = this.val.Get("txtCliente").valueChanges.pipe(
      startWith(''),
      map((value : string) => this._filter(value || ''))
    );




  }


  ngAfterViewInit(){


    //HABILITANDO CHECKBOK POR PROBLEMAS DE VIZUALIZACION
    const lstcheckbox : any = document.querySelectorAll("input[type='checkbox']")
    lstcheckbox.forEach((f : any) => {

      if(f.id != "chkDelivery"){
        f.bootstrapToggle();
      }
    });


  }
}

