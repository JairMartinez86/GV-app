import { Component, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FactDeliveryComponent } from "../fact-delivery/fact-delivery.component";
import { Validacion } from "src/app/SHARED/class/validacion";
import { getFactura } from "src/app/FAC/GET/get-factura";
import { Funciones } from "src/app/SHARED/class/cls_Funciones";
import { iCliente } from "src/app/FAC/interface/i-Cliente";
import { Observable } from "rxjs";
import { iBodega } from "src/app/FAC/interface/i-Bodega";
import { iVendedor } from "src/app/FAC/interface/i-venedor";
import { IgxComboComponent } from "igniteui-angular";
import { DialogErrorComponent } from "src/app/SHARED/componente/dialog-error/dialog-error.component";
import { iDatos } from "src/app/SHARED/interface/i-Datos";
import { WaitComponent } from "src/app/SHARED/componente/wait/wait.component";

@Component({
  selector: "app-fact-confirmar",
  templateUrl: "./fact-confirmar.component.html",
  styleUrls: ["./fact-confirmar.component.scss"],
})
export class FactConfirmarComponent {
  public val = new Validacion();

  
  public TipoFactura: string = "Factura";
  public TipoExoneracion: string = "Sin Exoneración";
  public TipoPago: string = "Contado";
  public TipoImpuesto: string = "Iva";

  public CodCliente : string = "";
  private NombreCliente : string = "";
  public Nombre : string = "";
  private CodVendedor : string = "";
  private CodBodega : string = "";
  private Plazo : number = 0;
  private Moneda : string = "";
  private isEvent: boolean = false;
  public Vizualizado : boolean = false;



  public lstBodega: iBodega[] = [];
  public lstVendedores: iVendedor[] = [];

  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  @ViewChild("cmbVendedor", { static: false })
  public cmbVendedor: IgxComboComponent;


  public constructor(private dialog: MatDialog, private cFunciones : Funciones, private Conexion : getFactura) {


    this.val.add("txtNoDoc", "1", "LEN>", "0", "No", "No se ha configurado el consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "No se ha configurado la fecha.");
    this.val.add("txtPlazo", "1", "LEN>=", "0", "Plazo", "No se ha definido un plazo");
    this.val.add("txtVence", "1", "LEN>=", "0", "Vence", "No se ha definido una fecha de vencimiento.");
    this.val.add("txtCliente", "1", "LEN>", "0", "Cliente", "No se ha seleccionado el cliente.");
    this.val.add("txtVendedor", "1", "LEN>", "0", "Vendedor", "No se ha seleccionado el vendedor.");
    this.val.add("txtNombre", "1", "LEN>=", "0", "Nombre", "");
    this.val.add("txtBodega", "1", "LEN>", "0", "Bodega", "No se ha seleccionado la bodega.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Bodega", "No se ha configurado la moneda.");
    this.val.add("txtNoExoneracion", "1", "LEN>=", "0", "Exoneracion", "");
    this.val.add("txtObservaciones", "1", "LEN>=", "0", "Observaciones", "");
    this.val.add("chkDelivery", "1", "LEN>=", "0", "Delivery", "");
    this.val.add("txtDelivery", "1", "LEN>=", "0", "Dirección", "");
    
  }

  public Iniciar(CodBodega : string, CodCliente: string,  Plazo :number, NombreCliente : string, Nombre : string,  CodVendedor : string, Moneda : string): void {
    this._Evento("Limpiar");
    this.CodBodega = CodBodega;
    this.CodCliente = CodCliente;
    this.NombreCliente = NombreCliente;
    this.Nombre = Nombre
    this.CodVendedor = CodVendedor;
    this.Moneda = Moneda;
    this.Plazo = Plazo;
    this.Vizualizado = true;


    this.val.Get("txtNoDoc").setValue("");
      this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.cFunciones.FechaServidor(), "yyyy-MM-dd"));
      this.val.Get("txtPlazo").setValue(this.Plazo);
      this.val.Get("txtVence").setValue(this.cFunciones.DateAddDay("Year",this.cFunciones.FechaServidor(), this.Plazo + (this.Plazo != 0 ? 1 : 0)));
      this.val.Get("txtCliente").setValue([this.NombreCliente]);
      this.val.Get("txtVendedor").setValue([this.CodVendedor]);
      this.val.Get("txtNombre").setValue(this.Nombre);
      this.val.Get("txtBodega").setValue([this.CodBodega]);
      this.val.Get("txtMoneda").setValue(this.Moneda == "C"? "Cordoba": "Dolar");
      this.val.Get("txtObservaciones").setValue("");
      this.val.Get("txtDelivery").setValue("");
      

      this.cmbBodega.setSelectedItem(this.CodBodega);
      this.cmbVendedor.setSelectedItem(this.CodVendedor);
      
   
  }


  public _Evento(e: string): void {
    switch (e) {
      case "Limpiar":


      this.val.Get("txtNoDoc").setValue("");
      this.val.Get("txtFecha").setValue("");
      this.val.Get("txtPlazo").setValue("");
      this.val.Get("txtVence").setValue("");
      this.val.Get("txtCliente").setValue("");
      this.val.Get("txtVendedor").setValue("");
      this.val.Get("txtNombre").setValue("");
      this.val.Get("txtBodega").setValue("");
      this.val.Get("txtMoneda").setValue("");
      this.val.Get("txtNoExoneracion").setValue("");
      this.val.Get("txtObservaciones").setValue("");
      this.val.Get("chkDelivery").setValue(false);
      this.val.Get("txtDelivery").setValue("");

      this.val.Get("txtNoDoc").disable();
      this.val.Get("txtFecha").disable();
      this.val.Get("txtPlazo").disable();
      this.val.Get("txtVence").disable();
      this.val.Get("txtCliente").disable();
      this.val.Get("txtBodega").disable();
      this.val.Get("txtMoneda").disable();
      this.val.Get("txtDelivery").disable();
      this.val.Get("txtNoExoneracion").disable();

      document.getElementById("btnDelivery")?.setAttribute("disabled", "disabled");

      let chk: any = document.querySelector("#chkImpuesto_Confirmar");
     chk.bootstrapToggle("on");
     
        break;
    }
  }



  public v_Select(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }



  public v_Select_Vendedor(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
      this.val.Get("txtVendedor").setValue(event.added);

      if (this.isEvent) {
        this.isEvent = false;
        return;
      } else {
        this.v_EsClienteClave(event.added);
      }
    }
  }


  public v_Enter_Vendedor(event: any) {
    if (event.key == "Enter") {
      this.isEvent = true;
      let _Item: iVendedor = this.cmbVendedor.dropdown.focusedItem.value;
      this.cmbVendedor.setSelectedItem(_Item.Codigo);
      this.val.Get("txtVendedor").setValue([_Item.Codigo]);

      this.v_EsClienteClave(_Item.Codigo);
    }
  }

  private v_EsClienteClave(CodNewVend: string): void {
    if (CodNewVend == "") return;

    

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        id: "wait",
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.Conexion.Datos_ClienteClave(this.CodCliente).subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos[] = _json["d"];
          let Clave: any = Datos[0].d;

          if (Clave.length > 0) {
            if (Clave[0].EsClave && Clave[0].CodVendedor != CodNewVend[0]) {
              this.cmbVendedor.setSelectedItem(Clave[0].CodVendedor);
              this.val.Get("txtVendedor").setValue(Clave[0].CodVendedor);
              this.cmbVendedor.close();

              this.dialog.open(DialogErrorComponent, {
                data:
                  "<p>Cliente Clave solo se permite seleccionar el vendedor:<b class='error'>" +
                  Clave[0].Vendedor +
                  "</b></p>",
              });
            }
          }
        }
      },
      (err) => {
        dialogRef.close();
        this.dialog.open(DialogErrorComponent, {
          data: "<b class='error'>" + err.message + "</b>",
        });
      }
    );
  }
  


  //████████████████████████████████████████████FICHA FACTURA████████████████████████████████████████████████████████████████████████
  public v_TipoPago(event: any): void {
    if (event.target.checked) {
      this.TipoPago = "Credito";
      return;
    }

    if (!event.target.checked) {
      this.TipoPago = "Contado";
      return;
    }
  }

  public v_TipoImpuesto(event: any): void {

    if(this.isEvent){
      this.isEvent = false;
      return;
    }
    this.isEvent = true;

    let chk: any = document.querySelector("#chkImpuesto_Confirmar");

    if( this.TipoExoneracion == "Sin Exoneración")
    {
      chk.bootstrapToggle("on");
    }
    else{
     
      chk.bootstrapToggle("off")
    }
    
    
    
    
  }

  //████████████████████████████████████████████VER FACTURA████████████████████████████████████████████████████████████████████████

  public v_TipoFactura(event: any): void {
   
    if (event.target.checked) {
      this.TipoFactura = "Factura";
      return;
    }

    if (!event.target.checked) {
      this.TipoFactura = "Pedido";
      return;
    }
  }

  public v_TipoExoneracion(event: any): void {

    this.isEvent = true;
    let chk: any  = document.querySelector("#chkImpuesto_Confirmar");

    this.val.replace("txtNoExoneracion", "1", "LEN>=", "0", "");

 

    if (!event.target.checked) {

      this.TipoExoneracion = "Sin Exoneración";
      chk.bootstrapToggle("on");  

      this.val.Get("txtNoExoneracion").disable();
      this.val.Get("txtNoExoneracion").setValue("");
      return;
    }

    if (event.target.checked) {
      this.val.replace("txtNoExoneracion", "1", "LEN>", "0", "Ingrese el numero de exoneración.");

      this.TipoExoneracion = "Exonerado";
      chk.bootstrapToggle("off");
      
      this.val.Get("txtNoExoneracion").enable();
      
      return;
    }
    
  }

  v_ActivarDelivery(event: any) : void{

    if (event.target.checked) {
      document.getElementById("btnDelivery")?.removeAttribute("disabled");
      this.val.Get("txtDelivery").enable();
      return;
    }

    if (!event.target.checked) {
      document.getElementById("btnDelivery")?.setAttribute("disabled", "disabled");
      this.val.Get("txtDelivery").setValue("");
      this.val.Get("txtDelivery").disable();
      return;
    }

  

  }
 

  public v_Delivery(): void {

    const dialogRef: MatDialogRef<FactDeliveryComponent> = this.dialog.open(
      FactDeliveryComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "",
        data: "",
      }
    );
  }
}
