import { Component, ViewChild } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FactDeliveryComponent } from "../fact-delivery/fact-delivery.component";
import { Validacion } from "src/app/SHARED/class/validacion";
import { getFactura } from "src/app/FAC/GET/get-factura";
import { Funciones } from "src/app/SHARED/class/cls_Funciones";
import { iCliente } from "src/app/FAC/interface/i-Cliente";
import { Observable } from "rxjs";
import { iBodega } from "src/app/FAC/interface/i-Bodega";
import { iVendedor } from "src/app/FAC/interface/i-venedor";
import { GlobalPositionStrategy, IgxComboComponent, OverlaySettings } from "igniteui-angular";
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { DialogErrorComponent } from "src/app/SHARED/componente/dialog-error/dialog-error.component";
import { iDatos } from "src/app/SHARED/interface/i-Datos";
import { WaitComponent } from "src/app/SHARED/componente/wait/wait.component";
import { iCredito } from "src/app/FAC/interface/i-Credito";
import { iDetalleFactura } from "src/app/FAC/interface/i-detalle-factura";
import { iDireccion } from "src/app/FAC/interface/i-Direccion";

@Component({
  selector: "app-fact-confirmar",
  templateUrl: "./fact-confirmar.component.html",
  styleUrls: ["./fact-confirmar.component.scss"],
})
export class FactConfirmarComponent {
  public val = new Validacion();
  public overlaySettings: OverlaySettings = {};

  public lstDetalle: iDetalleFactura[] = [];

  public TipoFactura: string = "Pedido";
  public TipoExoneracion: string = "Sin Exoneración";
  public TipoPago: string = "Contado";
  public TipoImpuesto: string = "Iva";
  public Serie: string = "";
  public Fecha: Date;

  public CodCliente: string = "";
  private NombreCliente: string = "";
  public Nombre: string = "";
  private CodVendedor: string = "";
  private CodBodega: string = "";
  public Plazo: number = 0;
  private isEvent: boolean = false;
  public Vizualizado: boolean = false;
  public SimboloMonedaCliente: string = "U$";
  public MonedaCliente: string;
  public Disponible = 0;
  public Impuesto: number = 0;
  public ImpuestoExo: number = 0;
  public TotalCordoba: number = 0;
  public TotalDolar: number = 0;
  public Restante: number = 0;
  public TC: number = 1;
  public i_Credito: iCredito[];
  public bol_Exportacion : boolean = false;
  public EsModal: boolean = false;
  public LoadEditar : boolean = false;
  public EsClienteConvenio = false;
  public LoadVenedor : boolean = false;



  public lstBodega: iBodega[] = [];
  public lstVendedores: iVendedor[] = [];
  private lstDirecciones: iDireccion[] = [];

  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  @ViewChild("cmbVendedor", { static: false })
  public cmbVendedor: IgxComboComponent;


  public constructor(private cFunciones: Funciones, private GET: getFactura) {


    this.val.add("chkEsPedido", "1", "LEN>=", "0", "Tipo Doc", "");
    this.val.add("txtNoDoc", "1", "LEN>", "0", "No", "No se ha configurado el consecutivo.");
    this.val.add("txtFecha", "1", "LEN>", "0", "Fecha", "No se ha configurado la fecha.");
    this.val.add("txtPlazo", "1", "LEN>=", "0", "Plazo", "No se ha definido un plazo");
    this.val.add("txtVence", "1", "LEN>=", "0", "Vence", "No se ha definido una fecha de vencimiento.");
    this.val.add("txtCliente", "1", "LEN>", "0", "Cliente", "No se ha seleccionado el cliente.");
    this.val.add("txtVendedor", "1", "LEN>", "0", "Vendedor", "No se ha seleccionado el vendedor.");
    this.val.add("txtNombre_Confirmar", "1", "LEN>=", "0", "Nombre", "");
    this.val.add("txtBodega", "1", "LEN>", "0", "Bodega", "No se ha seleccionado la bodega.");
    this.val.add("txtMoneda", "1", "LEN>", "0", "Bodega", "No se ha configurado la moneda.");
    this.val.add("txtLimite_Confirmar", "1", "LEN>=", "0", "Limite", "");
    this.val.add("txtDisponible_Confirmar", "1", "LEN>=", "0", "Disponible", "");
    this.val.add("txtNoExoneracion", "1", "LEN>=", "0", "Exoneracion", "");
    this.val.add("txtObservaciones", "1", "LEN>=", "0", "Observaciones", "");
    this.val.add("chkDelivery", "1", "LEN>=", "0", "Delivery", "");
    this.val.add("txtDireccion", "1", "LEN>=", "0", "Dirección", "");

  }

  public Iniciar(TipoFactura: string, CodBodega: string, CodCliente: string, Plazo: number, NombreCliente: string, Nombre: string, CodVendedor: string, Moneda: string,
    TipoPago: string, EsClienteConvenio : boolean, Exportacion : boolean, TC: number, lst: iDetalleFactura[]): void {

    this._Evento("Limpiar");
    this.Vizualizado = true;
    this.CodBodega = CodBodega;
    this.CodCliente = CodCliente;
    this.NombreCliente = NombreCliente;
    this.Nombre = Nombre
    this.CodVendedor = CodVendedor;
    this.MonedaCliente = Moneda;
    this.Plazo = Plazo;
    this.bol_Exportacion = Exportacion;
    this.TC = TC;
    this.TipoPago = TipoPago;
    this.TipoFactura = TipoFactura;
    this.EsClienteConvenio = EsClienteConvenio;


    this.lstDetalle = lst;




    this.SimboloMonedaCliente = "U$";
    if (Moneda == "C") this.SimboloMonedaCliente = "C$";




    this.val.Get("txtCliente").setValue(this.NombreCliente);
    this.val.Get("txtVendedor").setValue([this.CodVendedor]);
    this.val.Get("txtNombre_Confirmar").setValue(this.Nombre);
    this.val.Get("txtBodega").setValue([this.CodBodega]);
    this.val.Get("txtMoneda").setValue(this.MonedaCliente == "C" ? "Cordoba" : "Dolar");

    this.TipoPago = TipoPago;

    if (!this.Vizualizado && !this.EsModal) {
      this.val.Get("txtNoDoc").setValue("");
      this.val.Get("txtObservaciones").setValue("");
      this.val.Get("txtDireccion").setValue("");
    }

 
    this.cmbBodega.setSelectedItem(this.CodBodega);
    this.cmbVendedor.setSelectedItem(this.CodVendedor);
    document?.getElementById("txtCliente")?.focus();


    this.isEvent = true;
    let chk: any = document.querySelector("#chkEsPedido");
    chk.bootstrapToggle(this.TipoFactura == "Factura" ? "on" : "off");
    this.isEvent = false;
    this.val.Get("chkEsPedido").disable();


    this.v_Refrescar();

  }


  public _Evento(e: string): void {
    switch (e) {
      case "Limpiar":

        if (!this.Vizualizado && !this.EsModal) {
          this.Serie = "";
          this.i_Credito = [];
          this.Restante = 0;
          this.TipoPago = "Contado";
          this.Disponible = 0;
          this.Impuesto = 0;
          this.ImpuestoExo = 0;
          this.TotalCordoba = 0;
          this.TotalDolar = 0;
          this.TC = 1;
          this.val.Get("txtNoDoc").setValue("");
          this.val.Get("txtFecha").setValue("");
          this.val.Get("txtPlazo").setValue("");
          this.val.Get("txtVence").setValue("");
          this.val.Get("txtCliente").setValue("");
          this.val.Get("txtVendedor").setValue("");
          this.val.Get("txtNombre_Confirmar").setValue("");
          this.val.Get("txtBodega").setValue("");
          this.val.Get("txtMoneda").setValue("");
          this.val.Get("txtNoExoneracion").setValue("");
          this.val.Get("txtLimite_Confirmar").setValue("0.00");
          this.val.Get("txtDisponible_Confirmar").setValue("0.00");
          this.val.Get("txtObservaciones").setValue("");
          this.val.Get("chkDelivery").setValue(false);
          this.val.Get("txtDireccion").setValue("");

          document.getElementById("btnDelivery")?.setAttribute("disabled", "disabled");

          let chk: any = document.querySelector("#chkImpuesto_Confirmar");
          chk.bootstrapToggle("on");

        }


        this.val.Get("chkEsPedido").enable();
        this.val.Get("txtNoDoc").disable();
        this.val.Get("txtFecha").disable();
        this.val.Get("txtPlazo").disable();
        this.val.Get("txtVence").disable();
        this.val.Get("txtCliente").disable();
        this.val.Get("txtBodega").disable();
        this.val.Get("txtMoneda").disable();
        this.val.Get("txtDireccion").disable();
        this.val.Get("txtNoExoneracion").disable();
        this.val.Get("txtLimite_Confirmar").disable();
        this.val.Get("txtDisponible_Confirmar").disable();



        break;
    }
  }



  public v_Select(event: any) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }






  public v_Select_Vendedor(event: any) {
    console.log("as")
    if( this.LoadVenedor) return;
    if (event.added.length) {

      if(event.newValue.length > 1) event.newValue.splice(0, 1);

      let cmb: any = this.cmbVendedor.dropdown;
      let _Item: iVendedor = cmb._focusedItem.value;
      
      this.val.Get("txtVendedor").setValue(event.added);

      if (this.isEvent) {
        this.isEvent = false;
        return;
      } else {
        this.v_EsClienteClave(event.added);
      }

      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbVendedor.close();
    }
  }


  public v_Enter_Vendedor(event: any) {
    if (event.key == "Enter") {
      this.isEvent = true;
      let cmb: any = this.cmbVendedor.dropdown;
      let _Item: iVendedor = cmb._focusedItem.value;
      this.cmbVendedor.setSelectedItem(_Item.Codigo);
      this.val.Get("txtVendedor").setValue([_Item.Codigo]);

      this.v_EsClienteClave(_Item.Codigo);
    }
  }

  private v_EsClienteClave(CodNewVend: any): void {
    if (CodNewVend[0] == "") return;



    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {

        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.Datos_ClienteClave(this.CodCliente).subscribe(
      {
        next: (s) => {

          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];
            let Clave: any = Datos[0].d;

            if (Clave.length > 0) {
              if (Clave[0].EsClave && Clave[0].CodVendedor != CodNewVend[0].Codigo) {
                this.cmbVendedor.setSelectedItem(Clave[0].CodVendedor);
                this.val.Get("txtVendedor").setValue(Clave[0].CodVendedor);
                this.cmbVendedor.close();

                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  data:
                    "<p>Cliente Clave solo se permite seleccionar el vendedor:<b class='error'>" +
                    Clave[0].Vendedor +
                    "</b></p>",
                });
              }
            }
          }

        },
        error: (err) => {
          dialogRef.close();
          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {

        }
      }
    );

  }



  //████████████████████████████████████████████FICHA FACTURA████████████████████████████████████████████████████████████████████████
  public v_TipoPago(event: any): void {


    if (!event.target.checked) {
      this.TipoPago = "Contado";
      this.val.Get("txtLimite_Confirmar").setValue("0.00");
      this.val.Get("txtDisponible_Confirmar").setValue("0.00");
      this.Disponible = 0;
      this.Plazo = 0;
      this.val.Get("txtPlazo").setValue(this.Plazo);
      this.val.Get("txtVence").setValue(this.cFunciones.DateAdd("Day", this.Fecha, this.Plazo + (this.Plazo != 0 ? 1 : 0)));

      return;
    }

    let chk: any = document.querySelector("#chkTipoPago_Confirmar");
    // chk.bootstrapToggle("off");


    if(this.EsClienteConvenio && this.lstDetalle.length > 0) {
      chk.bootstrapToggle("off");
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: "<b class='error'>Cliente de convenio por favor elimine los productos antes de cambiar la forma de pago.</b>",
      });
      return;
    }


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.Plazo = 0;

    this.GET.Datos_Credito(this.CodCliente).subscribe(
      {
        next: (s) => {

          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
              chk.bootstrapToggle("off");
            }
          } else {
            let Datos: iDatos[] = _json["d"];
            this.i_Credito = Datos[0].d;

            this.val.Get("txtLimite_Confirmar").setValue("0.00");
            this.val.Get("txtDisponible_Confirmar").setValue("0.00");
            this.Disponible = 0;


            if (this.i_Credito.length > 0) {
              this.TipoPago = "Credito";
              this.val.Get("txtLimite_Confirmar").setValue(this.cFunciones.NumFormat(this.i_Credito[0].Limite, "2"));
              this.val.Get("txtDisponible_Confirmar").setValue(this.cFunciones.NumFormat(this.i_Credito[0].Disponible, "2"));
              this.Disponible = this.cFunciones.Redondeo(this.i_Credito[0].Disponible, "2");
              //this.Plazo = Number(Credito[0].Plazo) + Number(Credito[0].Gracia);
              this.Plazo = Number(this.i_Credito[0].Plazo);

              this.MonedaCliente = this.i_Credito[0].Moneda;
              this.SimboloMonedaCliente = "U$";
              if (this.i_Credito[0].Moneda == "C") this.SimboloMonedaCliente = "C$";

              this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.Fecha, "yyyy-MM-dd"));
              this.val.Get("txtPlazo").setValue(this.Plazo);
              this.val.Get("txtVence").setValue(this.cFunciones.DateAdd("Day", this.Fecha, this.Plazo + (this.Plazo != 0 ? 1 : 0)));

              this.Calcular();



              if (this.i_Credito[0].Plazo == 0) {
                this.Plazo = 0;
                this.TipoPago = "Contado";
                chk.bootstrapToggle("off");

                this.val.Get("txtPlazo").setValue(this.Plazo);
                this.val.Get("txtVence").setValue(this.cFunciones.DateAdd("Day", this.Fecha, this.Plazo + (this.Plazo != 0 ? 1 : 0)));
                this.Calcular();


                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  data: "<b class='error'>No tiene crédito disponible.</b>",
                });
              }
            } else {
              this.TipoPago = "Contado";
              chk.bootstrapToggle("off");
              this.Calcular();


              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                data: "<b class='error'>No tiene crédito asignado.</b>",
              });
            }
          }

        },
        error: (err) => {
          dialogRef.close();
          this.TipoPago = "Contado";
          chk.bootstrapToggle("off");

          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {

        }
      }
    );

  }

  public v_TipoImpuesto(event: any): void {

    if (this.isEvent) {
      this.isEvent = false;
      return;
    }
    this.isEvent = true;

    let chk: any = document.querySelector("#chkImpuesto_Confirmar");

    if (this.TipoExoneracion == "Sin Exoneración" && !this.bol_Exportacion) {
      chk.bootstrapToggle("on");
    }
    else {

      chk.bootstrapToggle("off")
    }




  }

  //████████████████████████████████████████████VER FACTURA████████████████████████████████████████████████████████████████████████

  public v_TipoFactura(event: any): void {
  if(this.LoadEditar) return;

    if (this.isEvent) {
      this.isEvent = false;
      return;
    }

    if (event.target.checked) {
      this.TipoFactura = "Factura";
      this.v_Refrescar();
      return;
    }

    if (!event.target.checked) {
      this.TipoFactura = "Pedido";
      this.v_Refrescar();
      return;
    }
  }

  public v_TipoExoneracion(event: any): void {

    this.isEvent = true;
    let chk: any = document.querySelector("#chkImpuesto_Confirmar");

    this.val.replace("txtNoExoneracion", "1", "LEN>=", "0", "");



    if (!event.target.checked || this.bol_Exportacion) {

      this.TipoExoneracion = "Sin Exoneración";
      chk.bootstrapToggle("on");

      if(this.bol_Exportacion)
      {
        let chkExo: any = document.querySelector("#chkExoneracion");
        chkExo.bootstrapToggle("off");
      }
     

   
      this.val.Get("txtNoExoneracion").disable();
      this.val.Get("txtNoExoneracion").setValue("");
      this.Calcular();
      return;
    }

    if (event.target.checked) {
      this.val.replace("txtNoExoneracion", "1", "LEN>", "0", "Ingrese el numero de exoneración.");

      this.TipoExoneracion = "Exonerado";
      chk.bootstrapToggle("off");

      this.val.Get("txtNoExoneracion").enable();
      this.Calcular();
      return;
    }

  }

  v_ActivarDelivery(event: any): void {


this.val.Get("chkDelivery").setValue(event.target.checked);

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    this.GET.Direcciones(this.CodCliente).subscribe(
      {
        next: (s) => {

          document.getElementById("btnRefrescarConfirmar")?.removeAttribute("disabled");
          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];

            this.lstDirecciones = Datos[0].d;

            let i: number = 0;
            this.lstDirecciones.forEach(f => {
              f.index = i;
              f.Seleccionar = false;
              if (f.Descripcion == "PRINCIPAL") f.Seleccionar = true;
              i++;
            });



            if (event.target.checked) {


              let Direccion = this.lstDirecciones.find(f => f.Descripcion == "PRINCIPAL");

              this.val.Get("txtDireccion").setValue("");
              if (Direccion != undefined) this.val.Get("txtDireccion").setValue(Direccion?.Direccion);
              document.getElementById("btnDelivery")?.removeAttribute("disabled");
              this.val.Get("txtDireccion").enable();
              return;
            }

            if (!event.target.checked) {
              document.getElementById("btnDelivery")?.setAttribute("disabled", "disabled");
              this.val.Get("txtDireccion").setValue("");
              this.val.Get("txtDireccion").disable();
              return;
            }

          }

        },
        error: (err) => {
          document.getElementById("btnRefrescarConfirmar")?.removeAttribute("disabled");
          dialogRef.close();

          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {

        }
      }
    );


  }


  public v_Delivery(): void {

    let dialogRef: MatDialogRef<FactDeliveryComponent> = this.cFunciones.DIALOG.open(
      FactDeliveryComponent,
      {
        panelClass: "escasan-dialog-full",//window.innerWidth < 992 ? "escasan-dialog-full" : "",
        data: this.lstDirecciones,
      }
    );


    dialogRef.afterClosed().subscribe(s => {
      this.val.Get("txtDireccion").setValue(dialogRef.componentInstance.Direccion);
    });


  }



  public v_Refrescar(): void {
    document.getElementById("btnRefrescarConfirmar")?.setAttribute("disabled", "disabled");


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );


    this.isEvent = true;


    this.GET.DatosSucursal(this.CodBodega, this.TipoFactura).subscribe(
      {
        next: (s) => {

          document.getElementById("btnRefrescarConfirmar")?.removeAttribute("disabled");
          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];

            if (!this.EsModal) {
              this.Fecha = new Date(this.cFunciones.DateFormat(Datos[0].d, 'yyyy-MM-dd hh:mm:ss'));
              this.TC = Datos[1].d;
              this.val.Get("txtNoDoc").setValue(Datos[2].d.split(";")[0]);
              this.Serie = Datos[2].d.split(";")[1];

              this.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.Fecha, "yyyy-MM-dd"));
            }


            this.val.Get("txtPlazo").setValue(this.Plazo);
            this.val.Get("txtVence").setValue(this.cFunciones.DateAdd("Day", this.Fecha, this.Plazo + (this.Plazo != 0 ? 1 : 0)));


            let chk: any = document.querySelector("#chkTipoPago_Confirmar");
            if (this.TipoPago == "Credito") {
              chk.bootstrapToggle("on");
            }
            else {
              chk.bootstrapToggle("off");
            }




            this.Calcular();

            this.isEvent = false;
          }

        },
        error: (err) => {
          document.getElementById("btnRefrescarConfirmar")?.removeAttribute("disabled");
          dialogRef.close();
          if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
          {
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor",
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        },
        complete: () => {

        }
      }
    );



  }


  public Calcular(): void {

    this.Impuesto = 0;
    this.ImpuestoExo = 0;
    this.TotalCordoba = 0;
    this.TotalDolar = 0;
    let Total: number = 0;

    if (this.TC == 0) this.TC = 1;

    this.lstDetalle.forEach(f => {

      let Precio: number = this.MonedaCliente == this.cFunciones.MonedaLocal ? f.PrecioCordoba : f.PrecioDolar;

      if (this.cFunciones.MonedaLocal == this.MonedaCliente) {
        f.PrecioCordoba = Precio;
        f.PrecioDolar = this.cFunciones.Redondeo(f.PrecioCordoba / this.TC, "4");
      }
      else {
        f.PrecioDolar = Precio;
        f.PrecioCordoba = this.cFunciones.Redondeo(f.PrecioCordoba * this.TC, "4");
      }


      let PrecioCordoba: number = f.PrecioCordoba;
      let PrecioDolar: number = f.PrecioDolar;
      let Cantidad: number = f.Cantidad;
      let PorDescuento: number = f.PorcDescuento;
      let PorcAdicional: number = f.PorcDescuentoAdicional;
      let PorcImpuesto: number = f.PorcImpuesto;


      f.EsExonerado = false;
      if(f.EsExento == undefined || f.ImpuestoExo != 0) f.EsExento = false;
      f.ImpuestoExo = 0;
      f.ImpuestoExoCordoba = 0;
      f.ImpuestoExoDolar = 0;
    



      if (this.cFunciones.MonedaLocal == this.MonedaCliente) {
        f.SubTotal = this.cFunciones.Redondeo(PrecioCordoba * Cantidad, "2");
        f.SubTotalCordoba = f.SubTotal;
        f.SubTotalDolar = this.cFunciones.Redondeo(f.SubTotalCordoba / this.TC, "2");


        f.Descuento = this.cFunciones.Redondeo(f.SubTotal * PorDescuento, "2");
        f.DescuentoCordoba = f.Descuento;
        f.DescuentoDolar = this.cFunciones.Redondeo(f.DescuentoCordoba / this.TC, "2");

        f.DescuentoAdicional = this.cFunciones.Redondeo(this.cFunciones.Redondeo(f.SubTotal - f.Descuento, "2") * PorcAdicional, "2");
        f.DescuentoAdicionalCordoba = f.DescuentoAdicional;
        f.DescuentoAdicionalDolar = this.cFunciones.Redondeo(f.DescuentoAdicionalCordoba / this.TC, "2");

        f.SubTotalNeto = this.cFunciones.Redondeo(f.SubTotal - (f.Descuento + f.DescuentoAdicional), "2");
        f.SubTotalNetoCordoba = f.SubTotalNeto;
        f.SubTotalNetoDolar = this.cFunciones.Redondeo(f.SubTotalNetoCordoba / this.TC, "2");

        f.Impuesto = this.cFunciones.Redondeo(f.SubTotalNeto * PorcImpuesto, "2");
        f.ImpuestoCordoba = f.Impuesto;
        f.ImpuestoDolar = this.cFunciones.Redondeo(f.ImpuestoCordoba / this.TC, "2");


        if ((this.TipoExoneracion == "Exonerado" || this.bol_Exportacion) && !f.EsBonif) {
          f.ImpuestoExo = f.Impuesto;
          f.ImpuestoExoCordoba = f.ImpuestoCordoba;
          f.ImpuestoExoDolar = f.ImpuestoDolar;
          if(this.TipoExoneracion == "Exonerado" && !f.EsExento)f.EsExonerado = true;
          if(this.bol_Exportacion && !f.EsExonerado)f.EsExento = true;

          f.Impuesto = 0;
          f.ImpuestoCordoba = 0;
          f.ImpuestoDolar = 0;
        }

        f.Total = this.cFunciones.Redondeo(f.SubTotalNeto + f.Impuesto, "2");
        f.TotalCordoba = f.Total;
        f.TotalDolar = this.cFunciones.Redondeo(f.TotalCordoba / this.TC, "2");

      }
      else {
        f.SubTotal = this.cFunciones.Redondeo(PrecioDolar * Cantidad, "2");
        f.SubTotalDolar = f.SubTotal;
        f.SubTotalCordoba = this.cFunciones.Redondeo(f.SubTotalDolar * this.TC, "2");

        f.Descuento = this.cFunciones.Redondeo(f.SubTotal * PorDescuento, "2");
        f.DescuentoDolar = f.Descuento;
        f.DescuentoCordoba = this.cFunciones.Redondeo(f.DescuentoDolar * this.TC, "2");

        f.DescuentoAdicional = this.cFunciones.Redondeo(this.cFunciones.Redondeo(f.SubTotal - f.Descuento, "2") * PorcAdicional, "2");
        f.DescuentoAdicionalDolar = f.DescuentoAdicional;
        f.DescuentoAdicionalCordoba = this.cFunciones.Redondeo(f.DescuentoAdicionalDolar * this.TC, "2");

        f.SubTotalNeto = this.cFunciones.Redondeo(f.SubTotal - (f.Descuento + f.DescuentoAdicional), "2");
        f.SubTotalDolar = f.SubTotalNeto;
        f.SubTotalCordoba = this.cFunciones.Redondeo(f.SubTotalDolar * this.TC, "2");

        f.Impuesto = this.cFunciones.Redondeo(f.SubTotalNeto * PorcImpuesto, "2");
        f.ImpuestoDolar = f.Impuesto;
        f.ImpuestoCordoba = this.cFunciones.Redondeo(f.ImpuestoCordoba * this.TC, "2");

        if ((this.TipoExoneracion == "Exonerado" || this.bol_Exportacion) && !f.EsBonif) {
          f.ImpuestoExo = f.Impuesto;
          f.ImpuestoExoCordoba = f.ImpuestoCordoba;
          f.ImpuestoExoDolar = f.ImpuestoDolar;
          if(this.TipoExoneracion == "Exonerado" && !f.EsExento)f.EsExonerado = true;
          if(this.bol_Exportacion && !f.EsExonerado)f.EsExento = true;

          f.Impuesto = 0;
          f.ImpuestoCordoba = 0;
          f.ImpuestoDolar = 0;
        }



        f.Total = this.cFunciones.Redondeo(f.SubTotalNeto + f.Impuesto, "2");
        f.TotalDolar = f.Total;
        f.TotalCordoba = this.cFunciones.Redondeo(f.TotalDolar * this.TC, "2");
      }




      Total += f.Total;
      this.Impuesto += this.cFunciones.Redondeo(f.Impuesto, "2");
      this.ImpuestoExo += this.cFunciones.Redondeo(f.ImpuestoExo, "2");
      this.TotalCordoba += this.cFunciones.Redondeo(f.TotalCordoba, "2");
      this.TotalDolar += this.cFunciones.Redondeo(f.TotalDolar, "2");


    });



    this.val.Get("txtDisponible_Confirmar").setValue(this.cFunciones.NumFormat(this.Disponible, "2"));
    this.Restante = this.Disponible;
    this.Restante = this.cFunciones.Redondeo(this.Disponible - Total, "2");
    if (this.TipoPago == "Credito") this.val.Get("txtDisponible_Confirmar").setValue(this.cFunciones.NumFormat(this.Restante, "2"));


  }

  private ngOnInit() {


    ///CAMBIO DE FOCO
    this.val.addFocus("txtNombreConfirmar", "txtObservaciones", undefined);
    this.val.addFocus("txtObservaciones", "btnGuardarFactura", "click");
    this.val.addFocus("txtNoExoneracion", "txtDireccion", undefined);
    this.val.addFocus("txtDireccion", "btnGuardarFactura", "click");





  }


  ngDoCheck() {

    this.overlaySettings = {};

    if (window.innerWidth <= 992) {
      this.overlaySettings = {
        positionStrategy: new GlobalPositionStrategy({ openAnimation: scaleInCenter, closeAnimation: scaleOutCenter }),
        modal: true,
        closeOnOutsideClick: true
      };
    }

  }


}
