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
import { iBodega } from '../../interface/i-Bodega';
import { iCredito } from '../../interface/i-Credito';
import { iVendedor } from '../../interface/i-venedor';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent {
  public val = new Validacion();

  public CodCliente : string = "";
  lstClientes: iCliente[] = [];
  filteredClientes: Observable<iCliente[]> | undefined;


  lstBodega: iBodega[] = [];
  lstVendedores: iVendedor[] = [];



  public Panel: String = '';
  public BotonSiguienteLabel = '';

  public TipoPago: String = 'Contado';
  public TipoImpuesto: String = 'Iva';
  public EsContraEntrega: Boolean = false;
  public EsExportacion: Boolean = false;
  public isKeyEnter : Boolean = false;

  

  public SimboloMonedaCliente: String = 'U$';
  private MonedaCliente : string;

  constructor(public dialog: MatDialog) {
    this.val.add(
      'txtCliente',
      '1',
      'LEN>',
      '0',
      'Cliente',
      'Seleccione un cliente.'
    );

    this.val.add("txtNombre", "1", "LEN>=", "0", "Nombre", "");
    this.val.add("txtIdentificacion", "1", "LEN>=", "0", "Ruc/Cedula", "");
    this.val.add("txtLimite", "1", "LEN>=", "0", "Limite", "");
    this.val.add("txtContacto", "1", "LEN>=", "0", "Contacto", "");
    this.val.add("txtDisponible", "1", "LEN>=", "0", "Disponible", "");

    this.val.add("txtBodega", "1", "LEN>", "0", "Bodega", "Seleccione una bodega.");
    this.val.add("txtVendedor", "1", "LEN>", "0", "Vendedor", "Seleccione un vendedor.");
    
    this._Evento("Iniciar");
  }

  private _Evento(e : string): void{
    switch(e){
      case "Iniciar":
        this.CargarDatos();
        this._Evento("Limpiar");
        
        break;

        case "Limpiar":
          this.SimboloMonedaCliente = "U$";
          this.val.Get("txtCliente").setValue(" ");
          this.val.Get("txtNombre").setValue("");
          this.val.Get("txtIdentificacion").setValue("");
          this.val.Get("txtLimite").setValue("0");
          this.val.Get("txtContacto").setValue("");
          this.val.Get("txtDisponible").setValue("0");


          this.val.Get("txtBodega").setValue("");
          this.val.Get("txtVendedor").setValue("");
        break;
    }

  }

  private CargarDatos(): void {
    let Conexion: getFactura = new getFactura();

    
    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        id: "wait",
        panelClass: 'escasan-dialog-full-blur',
        data: '',
      }
    );
    
    Conexion.Datos_Factura().subscribe(
      (s) => {

        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json['esError'] == 1) {
          this.dialog.open(
            DialogErrorComponent,
            {
              data: _json['msj'],
            }
          );
        } else {
          let Datos: iDatos[] = _json['d'];

          this.lstClientes = Datos[0].d;
          this.lstBodega = Datos[1].d;
          this.lstVendedores = Datos[2].d;
        }
      },
      (err) => {

        dialogRef.close();

         this.dialog.open(
          DialogErrorComponent,
          {
            data: "<b class='error'>" + err.message + "</b>",
          }
        );
      }
    );
  }

  //████████████████████████████████████████████DATOS CLIENTE████████████████████████████████████████████████████████████████████████

  public v_Select_Cliente(event: any): void {
    let Cliente : iCliente[] = this.lstClientes.filter( f => f.Key == event.option.value);

    this.CodCliente = "";
    this.val.Get("txtCliente").setValue("");
    this.val.Get("txtIdentificacion").setValue("");
    this.val.Get("txtLimite").setValue("0");
    this.val.Get("txtContacto").setValue("");
    this.val.Get("txtDisponible").setValue("0");
    this.cmbVendedor.setSelectedItem("");
    this.val.Get("txtVendedor").setValue("");

    if(Cliente.length > 0){
      this.CodCliente = Cliente[0].Codigo;
      this.val.Get("txtCliente").setValue(Cliente[0].Cliente);
      this.val.Get("txtIdentificacion").setValue(Cliente[0].Ruc + "/" + Cliente[0].Cedula);
      this.val.Get("txtLimite").setValue(Cliente[0].Limite);
      this.val.Get("txtContacto").setValue(Cliente[0].Contacto);
      this.val.Get("txtDisponible").setValue("0");

      if(this.val.Get("txtVendedor").value == "" || Cliente[0].EsClave)
      {
        this.cmbVendedor.setSelectedItem(Cliente[0].Vendedor);
        this.val.Get("txtVendedor").setValue([Cliente[0].Vendedor]);
      }
    


      this.MonedaCliente = Cliente[0].Moneda;
      this.SimboloMonedaCliente = "U$";
      if(Cliente[0].Moneda == "C")  this.SimboloMonedaCliente = "C$";

      this.val.Get("txtCliente").disable();
      
    }
  }



  public v_Borrar_Cliente() : void{
    this.CodCliente = "";
    this.val.Get("txtCliente").setValue("");
    this.val.Get("txtIdentificacion").setValue("");
    this.val.Get("txtLimite").setValue("0");
    this.val.Get("txtContacto").setValue("");
    this.val.Get("txtDisponible").setValue("0");


    this.SimboloMonedaCliente = "U$";
    this.val.Get("txtCliente").enable();

    

    let chk: any  = document.querySelector("#chkTipoFactura");
    this.TipoPago = 'Contado';
    chk.bootstrapToggle("off");


  }

  /*
 
 





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


  //BODEGA
  @ViewChild('cmbBodega', { static: false })
 public cmbBodega: IgxComboComponent;

 public v_Select_Bodega(event: any) {
  if (event.added.length) {
      event.newSelection = event.added;
      this.val.Get("txtBodega").setValue(event.added);
  }

}

public v_Enter_Bodega(event : any) {
 
  if(event.key == "Enter"){
    let _Item : iBodega =this.cmbBodega.dropdown.focusedItem.value
    this.cmbBodega.setSelectedItem(_Item.Codigo);
    this.val.Get("txtBodega").setValue(_Item.Codigo);
  }

}

public v_Close_Bodega(){
 // this.f_key_Enter(this.cmbBodega.id);
}

//VENDEDOR

@ViewChild('cmbVendedor', { static: false })
 public cmbVendedor: IgxComboComponent;

 public v_Select_Vendedor(event: any) {

 
  if (event.added.length) {
      event.newSelection = event.added;
      this.val.Get("txtVendedor").setValue(event.added);

      if(this.isKeyEnter){
        this.isKeyEnter = false;
        return;
      }
      else{
        this.v_EsClienteClave(event.added);
      }

    

      
  }

}

public v_Enter_Vendedor(event : any) {
 
  if(event.key == "Enter"){
    this.isKeyEnter = true;
    let _Item : iVendedor =this.cmbVendedor.dropdown.focusedItem.value
    this.cmbVendedor.setSelectedItem(_Item.Codigo);
    this.val.Get("txtVendedor").setValue(_Item.Codigo);
    
    this.v_EsClienteClave(_Item.Codigo);
  }

}

public v_Close_Vendedor(){
 // this.f_key_Enter(this.cmbVendedor.id);
}


private v_EsClienteClave(CodNewVend : string): void{

  if(CodNewVend == "") return;

  let Conexion: getFactura = new getFactura();

  let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
    WaitComponent,
    {
      id: "wait",
      panelClass: 'escasan-dialog-full-blur',
      data: '',
    }
  );


  Conexion.Datos_ClienteClave(this.CodCliente).subscribe(
    (s) => {

      dialogRef.close();
      let _json = JSON.parse(s);

      if (_json['esError'] == 1) {
        this.dialog.open(
          DialogErrorComponent,
          {
            data: _json['msj'],
          }
        );
      } else {
        let Datos: iDatos[] = _json['d'];
        let Clave: any = Datos[0].d;

        if(Clave.length > 0)
        {
          if(Clave[0].EsClave && Clave[0].CodVendedor != CodNewVend[0]){
            this.cmbVendedor.setSelectedItem(Clave[0].CodVendedor);
            this.val.Get("txtVendedor").setValue(Clave[0].CodVendedor);
            this.cmbVendedor.close();
  
            this.dialog.open(
              DialogErrorComponent,
              {
                data: "<p>Cliente Clave solo se permite seleccionar el vendedor:<b class='error'>" + Clave[0].Vendedor +"</b></p>",
              }
            );
  
          }
  
        }

    
       
      }
    },
    (err) => {

      dialogRef.close();
       this.dialog.open(
        DialogErrorComponent,
        {
          data: "<b class='error'>" + err.message + "</b>",
        }
      );
    }
  );

 

}


  
  
  public v_TipoPago(event: any): void {

    if (!event.target.checked) {
      this.TipoPago = 'Contado';
      return;
    }


    let chk: any  = document.querySelector("#chkTipoFactura");
   // chk.bootstrapToggle("off");


    let Conexion: getFactura = new getFactura();

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        id: "wait",
        panelClass: 'escasan-dialog-full-blur',
        data: '',
      }
    );
    

  
    Conexion.Datos_Credito(this.CodCliente).subscribe(
      (s) => {

        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json['esError'] == 1) {
          this.dialog.open(
            DialogErrorComponent,
            {
              data: _json['msj'],
            }
          );
        } else {
          let Datos: iDatos[] = _json['d'];
          let Credito: iCredito[] = Datos[0].d;

          this.val.Get("txtLimite").setValue(0);
          this.val.Get("txtDisponible").setValue(0);

          if(Credito.length > 0)
          {
            this.TipoPago = 'Credito';
            this.val.Get("txtLimite").setValue(Credito[0].Limite);
            this.val.Get("txtDisponible").setValue(Credito[0].Disponible);
  
  
            if(Credito[0].Plazo == 0){
              this.TipoPago = 'Contado';
              chk.bootstrapToggle("off");
              this.dialog.open(
                DialogErrorComponent,
                {
                  data: "<b class='error'>No tiene crédito disponible.</b>",
                }
              );
            }
          }
          else{
            this.TipoPago = 'Contado';
              chk.bootstrapToggle("off");

              this.dialog.open(
                DialogErrorComponent,
                {
                  data: "<b class='error'>No tiene crédito asignado.</b>",
                }
              );
          }

   
         
         
      
        }
      },
      (err) => {

        dialogRef.close();
        this.TipoPago = 'Contado';
        chk.bootstrapToggle("off");

         this.dialog.open(
          DialogErrorComponent,
          {
            data: "<b class='error'>" + err.message + "</b>",
          }
        );
      }
    );

    
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

   
  }

  ngOnInit() {
    //FILTRO CLIENTE
    this.filteredClientes = this.val.Get('txtCliente').valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        return this.lstClientes.filter((option) =>
          option.Filtro.toLowerCase().includes(
            (value || '').toLowerCase().trimStart()
          )
        );
      })
    );



  }

  ngAfterViewInit() {
    //HABILITANDO CHECKBOK POR PROBLEMAS DE VIZUALIZACION
    let lstcheckbox: any = document.querySelectorAll(
      "input[type='checkbox']"
    );
    lstcheckbox.forEach((f: any) => {
      if (f.id != 'chkDelivery') {
        f.bootstrapToggle();
      }
    });
  }
}
