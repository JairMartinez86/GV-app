import { Component, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { WaitComponent } from "src/app/SHARED/componente/wait/wait.component";
import { Validacion } from "src/app/SHARED/class/validacion";
import { getFactura } from "../../GET/get-factura";
import { DialogErrorComponent } from "src/app/SHARED/componente/dialog-error/dialog-error.component";
import { iDatos } from "src/app/SHARED/interface/i-Datos";
import { iCliente } from "../../interface/i-Cliente";
import {
  ConnectedPositioningStrategy,
  GlobalPositionStrategy,
  HorizontalAlignment,
  IgxComboComponent,
  OverlaySettings,
  PositionSettings,
  VerticalAlignment
} from "igniteui-angular";
import { scaleInCenter, scaleOutCenter } from 'igniteui-angular/animations';
import { iBodega } from "../../interface/i-Bodega";
import { iCredito } from "../../interface/i-Credito";
import { iVendedor } from "../../interface/i-venedor";
import { FactConfirmarComponent } from "./fact-confirmar/fact-confirmar.component";
import { Funciones } from "src/app/SHARED/class/cls_Funciones";
import { FactFichaProductoComponent } from "./fact-ficha-producto/fact-ficha-producto.component";
import { iDetalleFactura } from "../../interface/i-detalle-factura";
import { FactRevisionComponent } from "./fact-revision/fact-revision.component";
import { postFactura } from "../../POST/post-factura";
import { iFactPed } from "../../interface/i-Factura-Pedido";
import { DialogoConfirmarComponent } from "src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component";
import { ImprimirFacturaComponent } from "./registro-factura/imprimir-factura/imprimir-factura.component";
import { PDFDocument } from "pdf-lib";
import * as printJS from "print-js";

@Component({
  selector: "app-factura",
  templateUrl: "./factura.component.html",
  styleUrls: ["./factura.component.scss"],
})
export class FacturaComponent {
  public val = new Validacion();

  private CodBodega: string = "";
  public CodCliente: string = "";
  lstClientes: iCliente[] = [];
  filteredClientes: Observable<iCliente[]> | undefined;
  private Fila_Doc: iFactPed = {} as iFactPed;
  public TipoFactura: string = "Factura";

  lstBodega: iBodega[] = [];
  lstVendedores: iVendedor[] = [];

  public Panel: string = "";
  public BotonSiguienteLabel = "";
  public PermitirGuardar: boolean = true;

  public TipoPago: string = "Contado";
  public TipoImpuesto: string = "Iva";
  public Plazo: number = 0;
  public EsContraEntrega: boolean = false;
  public EsExportacion: boolean = false;
  public isEvent: boolean = false;
  private bol_Referescar: boolean = false;
  private Disponible: number = 0;
  public EsModal: boolean = false;
  private LoadEditar: boolean = false;
  public TipoPermiso: string = "";
  public EsClienteConvenio: boolean = false;

  public SimboloMonedaCliente: string = "U$";
  private MonedaCliente: string;



  public overlaySettings: OverlaySettings = {};

  @ViewChildren(IgxComboComponent)
  public lstCmb: QueryList<IgxComboComponent>;
  

  constructor(
    private cFunciones: Funciones,
    private GET: getFactura,
    private POST: postFactura
  ) {
    this.val.add(
      "txtCliente",
      "1",
      "LEN>",
      "0",
      "Cliente",
      "Seleccione un cliente."
    );

    this.val.add("txtNombre", "1", "LEN>=", "0", "Nombre", "");
    this.val.add("txtIdentificacion", "1", "LEN>=", "0", "Ruc/Cedula", "");
    this.val.add("txtLimite", "1", "LEN>=", "0", "Limite", "");
    this.val.add("txtContacto", "1", "LEN>=", "0", "Contacto", "");
    this.val.add("txtDisponible", "1", "LEN>=", "0", "Disponible", "");
    this.val.add("chkTipoFactura", "1", "LEN>=", "0", "Tipo Factura", "");
    this.val.add("chkImpuesto", "1", "LEN>=", "0", "Impuesto", "");
    this.val.add(
      "txtBodega",
      "1",
      "LEN>",
      "0",
      "Bodega",
      "Seleccione una bodega."
    );
    this.val.add(
      "txtVendedor",
      "1",
      "LEN>",
      "0",
      "Vendedor",
      "Seleccione un vendedor."
    );
    this.val.add("chkContraEntrega", "1", "LEN>=", "0", "Contra Entrega", "");
    this.val.add("chkExportacion", "1", "LEN>=", "0", "Exportación", "");
    this.val.add("txtOC", "1", "LEN>=", "0", "Orden de Compra", "");

    this._Evento("Iniciar");
  }

  public _Evento(e: string): void {
    switch (e) {
      case "Iniciar":
        this.CargarDatos();
        this._Evento("Limpiar");

        break;

      case "Limpiar":
        this.EsClienteConvenio = false;
        this.isEvent = true;
        this.Fila_Doc.IdVenta = "00000000-0000-0000-0000-000000000000";
        this.Fila_Doc.NoFactura = "";
        this.Fila_Doc.NoPedido = "";
        this.Panel = "";
        this.bol_Referescar = false;
        this.Plazo = 0;
        this.SimboloMonedaCliente = "U$";
        this.CodBodega = this.cFunciones.Bodega;
        this.val.Get("txtCliente").setValue("");
        this.val.Get("txtNombre").setValue("");
        this.val.Get("txtIdentificacion").setValue("");
        this.val.Get("txtLimite").setValue("0.00");
        this.val.Get("txtContacto").setValue("");
        this.val.Get("txtDisponible").setValue("0.00");
        this.val.Get("chkTipoFactura").setValue(false);
        this.TipoPago = "Contado";
        this.val.Get("chkImpuesto").setValue(true);
        this.TipoImpuesto = "Iva";
        this.val.Get("chkContraEntrega").setValue(false);
        this.val.Get("chkExportacion").setValue(false);
        this.val.Get("txtBodega").setValue([this.CodBodega]);
        this.val.Get("txtVendedor").setValue([]);

        this.FichaProducto?.lstDetalle.splice(
          0,
          this.FichaProducto.lstDetalle.length
        );
        this.ConfirmarFactura?._Evento("Limpiar");
        this.RevisionFactura?.lstDetalle.splice(
          0,
          this.FichaProducto.lstDetalle.length
        );

        this.Disponible = 0;
        this.CodCliente == "";
        //this.val.Get("txtBodega").disable();
        this.val.Get("txtCliente").enable();
        this.val.Get("txtLimite").disable();
        this.val.Get("txtDisponible").disable();

        let _iBodega = this.lstBodega.find(f => f.Codigo == this.CodBodega);

        if (_iBodega != undefined) {
          let cl = this.lstClientes.find((f) => f.Codigo == _iBodega?.ClienteContado);

          if (cl != undefined) {
            this.CodCliente = cl.Codigo;
            this.MonedaCliente = cl.Moneda;
            this.cmbCliente.setSelectedItem([cl.Codigo]);
            this.val.Get("txtCliente").setValue([cl.Codigo]);
            this.val.Get("txtVendedor").setValue([_iBodega.Vendedor]);
            this.val.Get("txtCliente").disable();
            this.MonedaCliente = cl.Moneda;
            this.SimboloMonedaCliente = "U$";
            if (cl.Moneda == "C") this.SimboloMonedaCliente = "C$";

          }
        }




        let chk: any = document.querySelector("#chkImpuesto");
        if (chk != undefined) chk.bootstrapToggle("on");

        let chk2: any = document.querySelector("#chkTipoFactura");
        if (chk2 != undefined) chk2.bootstrapToggle("off");
        this.isEvent = false;

        let chk3: any = document.querySelector("#chkExportacion");
        if (chk3 != undefined) chk3.bootstrapToggle("off");

        let chk4: any = document.querySelector("#chkContraEntrega");
        if (chk4 != undefined) chk4.bootstrapToggle("off");

        let chk5: any = document.querySelector("#chkExoneracion");
        if (chk5 != undefined) chk5.bootstrapToggle("off");


        this.isEvent = false;




        break;
    }
  }

  private CargarDatos(): void {
    document
      .getElementById("btnRefrescar")
      ?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.Datos_Factura().subscribe(
      {
        next: (s) => {

          document.getElementById("btnRefrescar")?.removeAttribute("disabled");
          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];

            this.lstClientes = Datos[0].d;
            this.lstBodega = Datos[1].d;
            this.lstVendedores = Datos[2].d;

            let _iBodega = this.lstBodega.find(f => f.Codigo == this.CodBodega);


            this.cmbBodega.setSelectedItem(this.CodBodega);


            if ((this.CodCliente == "" || this.cmbCliente.value.length == 0) && _iBodega != undefined) {
              let cl = this.lstClientes.find((f) => f.Codigo == _iBodega?.ClienteContado);

              if (cl != undefined) {
                this.CodCliente = cl.Codigo;
                this.MonedaCliente = cl.Moneda;
                this.cmbCliente.setSelectedItem(cl.Codigo);
                this.val.Get("txtCliente").setValue([cl.Codigo]);
                this.val.Get("txtVendedor").setValue([_iBodega.Vendedor]);
                this.val.Get("txtCliente").disable();

                this.MonedaCliente = cl.Moneda;
                this.SimboloMonedaCliente = "U$";
                if (cl.Moneda == "C") this.SimboloMonedaCliente = "C$";
              }
            }

            //LLENAR DATOS AL REFRESCAR
            if (this.bol_Referescar) {
              this.LlenarDatosCliente(this.CodCliente);
              this.bol_Referescar = false;
            }
          }

        },
        error: (err) => {
          document.getElementById("btnRefrescar")?.removeAttribute("disabled");
          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
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

  public v_Refrescar(): void {
    this.bol_Referescar = true;
    this.CargarDatos();
  }

  //████████████████████████████████████████████DATOS CLIENTE████████████████████████████████████████████████████████████████████████

  //CLIENTE
  @ViewChild("cmbCliente", { static: false })
  public cmbCliente: IgxComboComponent;


  public v_Select_Cliente(event: any): void {
    this.FichaProducto.lstDetalle.splice(
      0,
      this.FichaProducto.lstDetalle.length
    );
    this.CodCliente = "";
    this.val.Get("txtCliente").setValue("");
    this.val.Get("txtIdentificacion").setValue("");
    this.val.Get("txtLimite").setValue("0.00");
    this.val.Get("txtContacto").setValue("");
    this.val.Get("txtDisponible").setValue("0.00");
    this.cmbVendedor.setSelectedItem("");
    this.val.Get("txtVendedor").setValue([]);

    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      this.LlenarDatosCliente(event.newValue[0]);
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbCliente.close();
    }

  }


  public v_Enter_Cliente(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbCliente.dropdown;
      let _Item: iCliente = cmb._focusedItem.value;
      this.cmbCliente.setSelectedItem(_Item.Codigo);
      this.val.Get("txtCliente").setValue([_Item.Codigo]);
      this.CodCliente = _Item.Codigo;
    }
  }

  public v_Close_Cliente() {
    this.CodCliente = this.cmbCliente.value[0];
  }


  public v_Borrar_Cliente(): void {
    this.CodCliente = "";
    this.cmbCliente.setSelectedItem([]);
    this.FichaProducto.lstDetalle.splice(
      0,
      this.FichaProducto.lstDetalle.length
    );
    this.val.Get("txtCliente").setValue("");
    this.val.Get("txtIdentificacion").setValue("");
    this.val.Get("txtLimite").setValue("0.00");
    this.val.Get("txtContacto").setValue("");
    this.val.Get("txtDisponible").setValue("0.00");

    this.SimboloMonedaCliente = "U$";
    this.val.Get("txtCliente").enable();

    let chk: any = document.querySelector("#chkTipoFactura");
    this.TipoPago = "Contado";
    chk.bootstrapToggle("off");
  }

  private LlenarDatosCliente(cod: string): void {
    let Cliente: iCliente[] = this.lstClientes.filter(
      (f) => f.Key == cod || f.Codigo == cod
    );

    if (Cliente.length > 0) {
      this.CodCliente = Cliente[0].Codigo;
      this.val.Get("txtCliente").setValue([Cliente[0].Codigo]);
      this.val.Get("txtIdentificacion").setValue(Cliente[0].Ruc + "/" + Cliente[0].Cedula);
      this.val.Get("txtLimite").setValue(this.cFunciones.NumFormat(Cliente[0].Limite, "2"));
      this.val.Get("txtContacto").setValue(Cliente[0].Contacto);
      this.val.Get("txtDisponible").setValue("0.00");
      this.EsClienteConvenio = Cliente[0].EsClienteConvenio;

      if (this.val.Get("txtVendedor").value == "" || Cliente[0].EsClave) {
        this.cmbVendedor.setSelectedItem(Cliente[0].CodVendedor);
        this.val.Get("txtVendedor").setValue([Cliente[0].CodVendedor]);

        let index: number = this.lstVendedores.findIndex(
          (f) => f.Codigo == Cliente[0].CodVendedor
        );

        if (index == -1) {
          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data:
              "<p>No se cuentra el Vendedor: <b class='error'>" +
              Cliente[0].CodVendedor +
              "</b></p>",
          });
        }
      }

      this.MonedaCliente = Cliente[0].Moneda;
      this.SimboloMonedaCliente = "U$";
      if (Cliente[0].Moneda == "C") this.SimboloMonedaCliente = "C$";

      this.val.Get("txtCliente").disable();
    }
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
  @ViewChild("cmbBodega", { static: false })
  public cmbBodega: IgxComboComponent;

  public v_Select_Bodega(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem?.value;

      this.val.Get("txtBodega").setValue(event.newValue[0]);
      this.CodBodega = event.newValue[0];

      this.FichaProducto?.lstDetalle.splice(0,this.FichaProducto?.lstDetalle?.length);
   
      if(window.innerWidth <= this.cFunciones.TamanoPantalla("md")) this.cmbBodega.close();
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let cmb: any = this.cmbBodega.dropdown;
      let _Item: iBodega = cmb._focusedItem.value;
      this.cmbBodega.setSelectedItem(_Item.Codigo);
      this.val.Get("txtBodega").setValue([_Item.Codigo]);
      this.CodBodega = _Item.Codigo;
    }
  }

  public v_Close_Bodega() {
    // this.f_key_Enter(this.cmbBodega.id);
  }

  //VENDEDOR

  @ViewChild("cmbVendedor", { static: false })
  public cmbVendedor: IgxComboComponent;

  public v_Select_Vendedor(event: any) {
    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      let cmb: any = this.cmbVendedor.dropdown;
      let _Item: iVendedor = cmb._focusedItem?.value;

      this.val.Get("txtVendedor").setValue(event.newValue[0]);

      if (this.isEvent) {
        this.isEvent = false;
        return;
      } else {
        this.v_EsClienteClave(event.newValue[0]);
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

  public v_Close_Vendedor() {
    // this.f_key_Enter(this.cmbVendedor.id);
  }


  private v_EsClienteClave(CodNewVend: string): void {
    if (CodNewVend == "") return;
    if (this.LoadEditar) return;

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
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            let Datos: iDatos[] = _json["d"];
            let Clave: any = Datos[0].d;

            if (Clave.length > 0) {
              if (Clave[0].EsClave && Clave[0].CodVendedor != CodNewVend) {
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
          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
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


  public v_TipoPago(event: any): void {
    if (!event.target.checked) {
      this.TipoPago = "Contado";
      this.val.Get("txtLimite").setValue("0.00");
      this.val.Get("txtDisponible").setValue("0.00");
      this.Disponible = 0;
      this.Plazo = 0;
      return;
    }

    let chk: any = document.querySelector("#chkTipoFactura");
    // chk.bootstrapToggle("off");


    if (this.EsClienteConvenio && this.FichaProducto.lstDetalle.length > 0) {
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
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });

              chk.bootstrapToggle("off");
            }
          } else {
            let Datos: iDatos[] = _json["d"];
            let Credito: iCredito[] = Datos[0].d;

            this.val.Get("txtLimite").setValue("0.00");
            this.val.Get("txtDisponible").setValue("0.00");
            this.Disponible = 0;

            if (Credito.length > 0) {
              this.TipoPago = "Credito";
              this.val
                .Get("txtLimite")
                .setValue(this.cFunciones.NumFormat(Credito[0].Limite, "2"));
              this.val
                .Get("txtDisponible")
                .setValue(this.cFunciones.NumFormat(Credito[0].Disponible, "2"));
              this.Disponible = this.cFunciones.Redondeo(Credito[0].Disponible, "2");

              if (this.ConfirmarFactura.Vizualizado) {
                this.ConfirmarFactura.Disponible = this.Disponible;
                this.ConfirmarFactura.Calcular();
                this.val.Get("txtDisponible").setValue(this.cFunciones.NumFormat(this.ConfirmarFactura.Restante, "2"));
              }



              //this.Plazo = Number(Credito[0].Plazo) + Number(Credito[0].Gracia);
              this.Plazo = Number(Credito[0].Plazo);

              this.MonedaCliente = Credito[0].Moneda;
              this.SimboloMonedaCliente = "U$";
              if (Credito[0].Moneda == "C") this.SimboloMonedaCliente = "C$";

              if (Credito[0].Plazo == 0) {
                this.Plazo = 0;
                this.TipoPago = "Contado";
                chk.bootstrapToggle("off");
                this.cFunciones.DIALOG.open(DialogErrorComponent, {
                  data: "<b class='error'>No tiene crédito disponible.</b>",
                });
              }
            } else {
              this.TipoPago = "Contado";
              chk.bootstrapToggle("off");

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

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
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

    let chk: any = document.querySelector("#chkImpuesto");

    if (this.ConfirmarFactura.TipoExoneracion == "Sin Exoneración" && !this.EsExportacion) {
      chk.bootstrapToggle("on");
    }
    else {

      chk.bootstrapToggle("off");
    }


    /*

    if (event.target.checked) {
      this.TipoImpuesto = "Sin Iva";
      return;
    }

    if (!event.target.checked) {
      this.TipoImpuesto = "Iva";
      return;
    }*/
  }

  public v_ContraEntrega(event: any): void {
    this.EsContraEntrega = event.target.checked;
  }

  public v_Exportacion(event: any): void {


    if (this.ConfirmarFactura!.TipoExoneracion == "Exonerado") {

      let chkExport: any = document.querySelector("#chkExportacion");
      if (chkExport != undefined) chkExport.bootstrapToggle("off");
      return;
    }



    this.EsExportacion = event.target.checked;

    this.TipoImpuesto = "Iva"

    let chk: any = document.querySelector("#chkImpuesto");
    if (chk != undefined) chk.bootstrapToggle("on");

    if (this.EsExportacion) {
      this.TipoImpuesto = "Sin Iva"

      let chk: any = document.querySelector("#chkImpuesto");
      if (chk != undefined) chk.bootstrapToggle("off");

    }


  }

  public v_FichaPanel(evento: string): void {
    this.val.EsValido();

    if (this.val.Errores != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }

    if (this.CodCliente == "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: "<b>Seleccione un cliente.</b>",
      });

      return;
    }

    (document.querySelector("#frmFichaFactura") as HTMLElement).setAttribute(
      "style",
      "display:none;"
    );

    (document.querySelector("#frmFichaProducto") as HTMLElement).setAttribute(
      "style",
      "display:none;"
    );

    (document.querySelector("#frmRevision") as HTMLElement).setAttribute(
      "style",
      "display:none;"
    );

    (
      document.querySelector("#frmConfirmarFactura") as HTMLElement
    ).setAttribute("style", "display:none;");

    if (
      (evento == "Siguiente" && this.Panel == "") ||
      (evento == "Atras" && this.Panel == "Revision")
    ) {
      this.Panel = "Producto";
      this.BotonSiguienteLabel = "Ver Producto";

      (document.querySelector("#frmFichaProducto") as HTMLElement).setAttribute(
        "style",
        "display:initial;"
      );

      this.LlenarDatosfichaProducto();

      return;
    }

    if (evento == "Atras" && this.Panel == "Producto") {
      this.Panel = "";
      this.BotonSiguienteLabel = "";

      (document.querySelector("#frmFichaFactura") as HTMLElement).setAttribute(
        "style",
        "display:initial;"
      );

      if (this.ConfirmarFactura.Vizualizado) {
        this.val.Get("txtNombre").setValue(this.ConfirmarFactura.Nombre);
        this.Plazo = this.ConfirmarFactura.Plazo;
        this.TipoPago = this.ConfirmarFactura.TipoPago;

        let chk: any = document.querySelector("#chkTipoFactura");
        if (this.TipoPago == "Credito") {
          chk.bootstrapToggle("on");
        } else {
          chk.bootstrapToggle("off");
        }

        let chkExo: any = document.querySelector("#chkImpuesto");
        this.isEvent = true;
        if (this.ConfirmarFactura.TipoExoneracion == "Sin Exoneración" && !this.EsExportacion) {
          chkExo.bootstrapToggle("on");
        } else {
          chkExo.bootstrapToggle("off");
        }
      }

      return;
    }

    if (
      (evento == "Siguiente" && this.Panel == "Producto") ||
      (evento == "Atras" && this.Panel == "Confirmar")
    ) {
      this.Panel = "Revision";
      this.BotonSiguienteLabel = "Confirmar";

      (document.querySelector("#frmRevision") as HTMLElement).setAttribute(
        "style",
        "display:initial;"
      );

      if (evento == "Atras") {
        this.FichaProducto.lstDetalle = this.ConfirmarFactura.lstDetalle;
        this.FichaProducto.TC = this.ConfirmarFactura.TC;
        this.MonedaCliente = this.ConfirmarFactura.MonedaCliente;
        this.TipoPago = this.ConfirmarFactura.TipoPago;
        this.Disponible = this.ConfirmarFactura.Disponible;
        this.val.Get("txtDisponible").setValue(this.cFunciones.NumFormat(this.ConfirmarFactura.Disponible, "2"));
        if (this.TipoPago == "Credito") this.val.Get("txtDisponible").setValue(this.cFunciones.NumFormat(this.ConfirmarFactura.Restante, "2"));
        this.cmbVendedor.setSelectedItem(this.ConfirmarFactura.val.Get("txtVendedor").value[0]);
        // this.val.Get("txtVendedor").setValue(this.ConfirmarFactura.val.Get("txtVendedor").value);
      }

      this.LlenarRevision();

      return;
    }

    if (evento == "Siguiente" && this.Panel == "Revision") {
      this.Panel = "Confirmar";
      this.BotonSiguienteLabel = this.TipoFactura == "Factura" ? "Facturar" : "Pedido";
      (
        document.querySelector("#frmConfirmarFactura") as HTMLElement
      ).setAttribute("style", "display:initial;");

      if (this.TipoFactura == "Pedido" && this.EsModal) {
        let TotalPorAutorizar = this.RevisionFactura.lstDetalle.filter(f => f.PedirAutorizado || f.PrecioLiberado).length;
        let TotalAutorizado = this.RevisionFactura.lstDetalle.filter(f => f.Autorizado).length;

        this.BotonSiguienteLabel = "Guardar";
        if (TotalAutorizado > 0) this.BotonSiguienteLabel = "Autorizar Parcial";
        if (TotalPorAutorizar == TotalAutorizado) this.BotonSiguienteLabel = "Autorización";
        if (this.TipoPermiso == "1") this.BotonSiguienteLabel = "Modificar Pedido";
      }

      this.LlenarDatosConfirmacion();

      return;
    }

    if (evento == "Siguiente" && this.Panel == "Confirmar") {
      this.Panel = "Confirmar";
      this.BotonSiguienteLabel = this.TipoFactura == "Factura" ? "Facturar" : "Pedido";


      (
        document.querySelector("#frmConfirmarFactura") as HTMLElement
      ).setAttribute("style", "display:initial;");


      this.v_Guardar()

      return;
    }
  }

  //████████████████████████████████████████████FICHA PRODUCTO████████████████████████████████████████████████████████████████████████

  @ViewChild("FichaProducto", { static: false })
  public FichaProducto: FactFichaProductoComponent;

  private LlenarDatosfichaProducto(): void {
    this.FichaProducto.Iniciar(
      this.CodBodega,
      this.CodCliente,
      this.MonedaCliente,
      this.ConfirmarFactura.TipoExoneracion,
      this.EsExportacion,
      this.TipoPago,
      this.EsClienteConvenio,
      this.EsModal
    );
  }

  //████████████████████████████████████████████REVISION FACTURA████████████████████████████████████████████████████████████████████████

  @ViewChild("RevisionFactura", { static: false })
  public RevisionFactura: FactRevisionComponent;

  private LlenarRevision(): void {
    this.RevisionFactura.Iniciar(
      this.FichaProducto.lstDetalle,
      this.FichaProducto.TC,
      this.MonedaCliente,
      this.ConfirmarFactura.TipoExoneracion,
      this.EsExportacion
    );
  }

  //████████████████████████████████████████████CONFIRMAR FACTURA████████████████████████████████████████████████████████████████████

  @ViewChild("ConfirmarFactura", { static: false })
  public ConfirmarFactura: FactConfirmarComponent;

  private LlenarDatosConfirmacion(): void {
    this.ConfirmarFactura.lstBodega = this.lstBodega;
    this.ConfirmarFactura.lstVendedores = this.lstVendedores;
    let c_Cliente: iCliente = this.lstClientes.find(f => f.Codigo == this.CodCliente)!;

    this.ConfirmarFactura.Iniciar(
      this.TipoFactura,
      this.CodBodega,
      this.CodCliente,
      this.Plazo,
      c_Cliente.Cliente,
      this.val.Get("txtNombre").value,
      this.val.Get("txtVendedor").value[0],
      this.MonedaCliente,
      this.TipoPago,
      this.EsClienteConvenio,
      this.EsExportacion,
      this.RevisionFactura.TC,
      this.RevisionFactura.lstDetalle
    );
  }



  public v_Guardar(): void {



    let ErrorFicha: string = "";
    let ErrorConfirmar: string = "";
    let ErrorOtros: string = "";
    let PedirAutorizacion: boolean = false;

    this.val.EsValido();
    this.ConfirmarFactura.val.EsValido();

    ErrorFicha = this.val.Errores;
    ErrorConfirmar = this.ConfirmarFactura.val.Errores;




    if (ErrorFicha != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: ErrorFicha,
      });

      return;
    }

    if (ErrorConfirmar != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: ErrorConfirmar,
      });

      return;
    }

    if (this.ConfirmarFactura.TipoPago == "Credito") {
      let Total: number = 0;
      let Restante: number = 0;
      Total = this.cFunciones.Redondeo(this.ConfirmarFactura.TotalDolar, "2");
      if (this.MonedaCliente == "C") Total = this.cFunciones.Redondeo(this.ConfirmarFactura.TotalCordoba, "2");

      Restante = this.cFunciones.Redondeo(this.ConfirmarFactura.Disponible - Total, "2");


      if (Restante < 0) ErrorOtros += "<li class='error-etiqueta'>Disponible<ul><li class='error-mensaje'>No tiene disponible.</li></ul>";

      if (this.ConfirmarFactura.i_Credito.length == 0) {
        ErrorOtros += "<li class='error-etiqueta'>Credito<ul><li class='error-mensaje'>El cliente no tiene configurado el credito.</li></ul>";
      }
      else {
        if (this.ConfirmarFactura.i_Credito[0].SaldoVencido > 0 && !this.ConfirmarFactura.i_Credito[0].FacturarVencido && !this.EsModal) {
          ErrorOtros += "<li class='error-etiqueta'>Credito<ul><li class='error-mensaje'>El cliente tiene saldo vencido.</li></ul>";
        }
      }


    }

    if (this.RevisionFactura.lstDetalle.length == 0) {
      ErrorOtros += "<li class='error-etiqueta'>Productos<ul><li class='error-mensaje'>Registre al menos un producto para facturar.</li></ul>";

    }
    else {
      if (this.RevisionFactura.lstDetalle.filter(f => !f.EsBonif && !f.EsBonifLibre).length == 0) ErrorOtros += "<li class='error-etiqueta'>Productos<ul><li class='error-mensaje'>Registre al menos un producto que no sea bonificado.</li></ul>";

    }


    if (!this.PermitirGuardar) {
      ErrorOtros = "No se permite modificar factura."
    }


    if (ErrorOtros != "") {
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data:
          "<ul>" + ErrorOtros + "</ul>",
      });

      return;

    }


    let iBodega = this.lstBodega.find(f => f.Codigo == this.CodBodega);
    let iCLiente = this.lstClientes.find(f => f.Codigo == this.CodCliente);
    let iVendedor = this.lstVendedores.find(f => f.Codigo == this.cmbVendedor.value[0]);
    if (this.RevisionFactura.lstDetalle.filter(f => f.PrecioLiberado || f.PedirAutorizado).length > 0) PedirAutorizacion = true;




    //this.Fila_Doc.IdVenta = "";
    //this.Fila_Doc.NoFactura = "";
    //this.Fila_Doc.NoPedido = "";
    this.Fila_Doc.TipoDocumento = this.ConfirmarFactura.TipoFactura;
    this.Fila_Doc.Serie = this.ConfirmarFactura.Serie;
    if (this.ConfirmarFactura.TipoFactura == "Factura") this.Fila_Doc.NoFactura = this.ConfirmarFactura.val.Get("txtNoDoc").value;
    if (this.ConfirmarFactura.TipoFactura == "Pedido") this.Fila_Doc.NoPedido = this.ConfirmarFactura.val.Get("txtNoDoc").value;
    this.Fila_Doc.CodCliente = this.ConfirmarFactura.CodCliente;
    this.Fila_Doc.NomCliente = iCLiente!.Cliente;
    this.Fila_Doc.Nombre = this.ConfirmarFactura.val.Get("txtNombre_Confirmar").value;
    this.Fila_Doc.RucCedula = this.val.Get("txtIdentificacion").value;
    this.Fila_Doc.Contacto = this.val.Get("txtContacto").value;
    this.Fila_Doc.Limite = this.ConfirmarFactura.val.Get("txtLimite_Confirmar").value;
    this.Fila_Doc.Disponible = this.ConfirmarFactura.val.Get("txtDisponible_Confirmar").value;
    this.Fila_Doc.CodBodega = this.CodBodega;
    this.Fila_Doc.NomBodega = iBodega!.Bodega;
    this.Fila_Doc.CodVendedor = iVendedor!.Codigo;
    this.Fila_Doc.NomVendedor = iVendedor!.Vendedor;
    this.Fila_Doc.EsContraentrega = this.EsContraEntrega;
    this.Fila_Doc.EsExportacion = this.EsExportacion;
    this.Fila_Doc.OrdenCompra = this.val.Get("txtOC").value;
    this.Fila_Doc.Fecha = this.ConfirmarFactura.val.Get("txtFecha").value;
    this.Fila_Doc.Plazo = this.ConfirmarFactura.Plazo;
    this.Fila_Doc.Vence = this.ConfirmarFactura.val.Get("txtVence").value;
    this.Fila_Doc.Moneda = this.ConfirmarFactura.MonedaCliente;
    this.Fila_Doc.TipoVenta = this.ConfirmarFactura.TipoPago;
    this.Fila_Doc.TipoImpuesto = this.ConfirmarFactura.TipoImpuesto;
    this.Fila_Doc.TipoExoneracion = this.ConfirmarFactura.TipoExoneracion;
    this.Fila_Doc.NoExoneracion = this.ConfirmarFactura.val.Get("txtNoExoneracion").value;
    this.Fila_Doc.EsDelivery = this.ConfirmarFactura.val.Get("chkDelivery").value;
    this.Fila_Doc.Direccion = this.ConfirmarFactura.val.Get("txtDireccion").value;
    this.Fila_Doc.Observaciones = this.ConfirmarFactura.val.Get("txtObservaciones").value;
    this.Fila_Doc.Impuesto = this.ConfirmarFactura.Impuesto;
    this.Fila_Doc.Exonerado = this.ConfirmarFactura.ImpuestoExo;
    this.Fila_Doc.TotalCordoba = this.ConfirmarFactura.TotalCordoba;
    this.Fila_Doc.TotalDolar = this.ConfirmarFactura.TotalDolar;
    this.Fila_Doc.PedirAutorizacion = PedirAutorizacion;
    this.Fila_Doc.FechaRegistro = new Date();
    this.Fila_Doc.UsuarioRegistra = this.cFunciones.User;
    this.Fila_Doc.TasaCambio = this.ConfirmarFactura.TC;
    this.Fila_Doc.Estado = "Solicitado";
    this.Fila_Doc.MotivoAnulacion = "";
    this.Fila_Doc.VentaDetalle = this.RevisionFactura.lstDetalle;

    let TotalPorAutorizar = this.RevisionFactura.lstDetalle.filter(f => f.PedirAutorizado || f.PrecioLiberado).length;
    let TotalAutorizado = this.RevisionFactura.lstDetalle.filter(f => f.Autorizado).length;

    if (TotalAutorizado > 0 && this.EsModal) {

      let dialogoConfirmar: MatDialogRef<DialogoConfirmarComponent> = this.cFunciones.DIALOG.open(DialogoConfirmarComponent, { disableClose: true })

      dialogoConfirmar.componentInstance.mensaje = "<p ><b class='bold'>Autorizar Margenes / Precios?</b></p>";
      dialogoConfirmar.componentInstance.textBoton1 = "Si";
      dialogoConfirmar.componentInstance.textBoton2 = "No";


      dialogoConfirmar.afterClosed().subscribe(s => {

        if (dialogoConfirmar.componentInstance.retorno == "1") {
          this.Fila_Doc.PedirAutorizacion = true;
          if (TotalPorAutorizar == TotalAutorizado) this.Fila_Doc.PedirAutorizacion = false;
          this.EnviarDatos();
        }

      });

    }
    else {
      this.EnviarDatos();
    }


  }

  private EnviarDatos() {

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.POST.GuardarFactura(this.Fila_Doc).subscribe(
      {
        next: (s) => {

          dialogRef.close();
          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          }
          else {

            if (this.TipoFactura == "Factura") {
 
              this.printPDFS(_json["d"]);


            }
            else {

              let Datos: iDatos[] = _json["d"];
              let Consecutivo: string = Datos[0].d;


              if (this.EsModal) {
                if (this.cFunciones.DIALOG.getDialogById("dialog-factura-editar") != undefined) this.cFunciones.DIALOG.getDialogById("dialog-factura-editar")?.close();


                return;
              }



              
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              data: "<p>Documento Generado: <b class='bold'>" + Consecutivo + "</b></p>"
            });

            }





            this._Evento("Limpiar");

            (document.querySelector("#frmFichaFactura") as HTMLElement).setAttribute(
              "style",
              "display:initial;"
            );

            (document.querySelector("#frmConfirmarFactura") as HTMLElement).setAttribute(
              "style",
              "display:none;"
            );

          }

        },
        error: (err) => {
          dialogRef.close();

          if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
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

  public v_Editar(det: iFactPed, TipoPermiso: string) {
    this.TipoPermiso = TipoPermiso;
    this.RevisionFactura.TipoPermiso = TipoPermiso;

    this.EsModal = true;
    this.isEvent = false;
    this.Fila_Doc = det;
    this.LoadEditar = true;
    this.ConfirmarFactura.LoadEditar = this.LoadEditar;


    this.cmbBodega.setSelectedItem(this.Fila_Doc.CodBodega);
    this.val.Get("txtBodega").setValue([this.Fila_Doc.CodBodega]);


    this.cmbCliente.setSelectedItem(this.Fila_Doc.CodCliente);
    this.val.Get("txtCliente").setValue([this.Fila_Doc.CodCliente]);





    this.RevisionFactura.EsModal = true;
    this.ConfirmarFactura.EsModal = true;
    this.CodCliente = this.Fila_Doc.CodCliente;
    this.MonedaCliente = this.Fila_Doc.Moneda;
    this.CodBodega = this.Fila_Doc.CodBodega;

    this.val.Get("txtNombre").setValue(this.Fila_Doc.Nombre);
    this.val.Get("txtIdentificacion").setValue(this.Fila_Doc.RucCedula);
    this.val.Get("txtContacto").setValue(this.Fila_Doc.Contacto);
    this.val.Get("txtLimite").setValue(this.Fila_Doc.Limite);
    this.val.Get("txtDisponible").setValue(this.Fila_Doc.Disponible);



    this.cmbVendedor.setSelectedItem(this.Fila_Doc.CodVendedor);
    this.val.Get("txtVendedor").setValue([this.Fila_Doc.CodVendedor]);

    this.val.Get("txtOC").setValue(this.Fila_Doc.OrdenCompra);


    let chk1: any = document.querySelector("#chkTipoFactura");
    chk1.bootstrapToggle("off");
    if (this.Fila_Doc.TipoVenta == "Credito") chk1.bootstrapToggle("on");


    let chk2: any = document.querySelector("#chkExportacion");
    chk2.bootstrapToggle("off");
    if (this.Fila_Doc.EsExportacion) chk2.bootstrapToggle("on");

    let chk3: any = document.querySelector("#chkContraEntrega");
    chk3.bootstrapToggle("off");
    if (this.Fila_Doc.EsContraentrega) chk3.bootstrapToggle("on");



    let chk4: any = document.querySelector("#chkEsPedido");
    chk4.bootstrapToggle("off");
    if (this.Fila_Doc.TipoDocumento == "Factura") chk4.bootstrapToggle("on");

    this.TipoFactura = this.Fila_Doc.TipoDocumento;
    this.ConfirmarFactura.TipoPago = this.Fila_Doc.TipoVenta;
    this.FichaProducto.TC = this.Fila_Doc.TasaCambio;
    this.ConfirmarFactura.TipoFactura = this.Fila_Doc.TipoDocumento;
    this.ConfirmarFactura.Serie = this.Fila_Doc.Serie;
    if (this.Fila_Doc.TipoDocumento == "Factura") this.ConfirmarFactura.val.Get("txtNoDoc").setValue(this.Fila_Doc.NoFactura);
    if (this.Fila_Doc.TipoDocumento == "Pedido") this.ConfirmarFactura.val.Get("txtNoDoc").setValue(this.Fila_Doc.NoPedido);

    this.Plazo = this.Fila_Doc.Plazo;
    this.ConfirmarFactura.Fecha = new Date(this.cFunciones.DateFormat(this.Fila_Doc.Fecha, 'yyyy-MM-dd hh:mm:ss'));
    this.ConfirmarFactura.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(this.ConfirmarFactura.Fecha, "yyyy-MM-dd"));
    this.ConfirmarFactura.val.Get("txtPlazo").setValue(this.Plazo);
    this.ConfirmarFactura.val.Get("txtVence").setValue(this.cFunciones.DateAdd("Day", this.ConfirmarFactura.Fecha, this.Plazo + (this.Plazo != 0 ? 1 : 0)));


    this.ConfirmarFactura.val.Get("txtMoneda").setValue(this.Fila_Doc.Moneda);
    this.ConfirmarFactura.val.Get("chkDelivery").setValue(this.Fila_Doc.EsDelivery);
    this.ConfirmarFactura.val.Get("txtDireccion").setValue(this.Fila_Doc.Direccion);
    this.ConfirmarFactura.val.Get("txtObservaciones").setValue(this.Fila_Doc.Observaciones);

    let chk5: any = document.querySelector("#chkExoneracion");
    chk5.bootstrapToggle("off");
    if (this.Fila_Doc.TipoExoneracion == "Exonerado") chk5.bootstrapToggle("on");
    this.ConfirmarFactura.val.Get("txtNoExoneracion").setValue(this.Fila_Doc.NoExoneracion);

    this.FichaProducto.lstDetalle = this.Fila_Doc.VentaDetalle;


    this.Panel = "Producto";
    this.v_FichaPanel("Siguiente");

    if (det.TipoDocumento == "Factura") this.PermitirGuardar = false;
    this.LoadEditar = true;
    this.ConfirmarFactura.LoadEditar = this.LoadEditar;


  }



  async printPDFS(datos: any) {



    let byteArray = new Uint8Array(atob(datos[0].d).split('').map(char => char.charCodeAt(0)));

    var file = new Blob([byteArray], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);

    let tabOrWindow : any = window.open(url, '_blank');
    tabOrWindow.focus();




    
    let byteArray2 = new Uint8Array(atob(datos[1].d).split('').map(char => char.charCodeAt(0)));

    var file2 = new Blob([byteArray2], { type: 'application/pdf' });

    let url2 = URL.createObjectURL(file2);

    let tabOrWindow2 : any = window.open(url2, '_blank');
    tabOrWindow2.focus();



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

  private ngOnInit() {




    //FILTRO CLIENTE
    this.filteredClientes = this.val.Get("txtCliente").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        return this.lstClientes.filter((option) =>
          option.Filtro.toLowerCase().includes(
            (value || "").toLowerCase().trimStart()
          )
        );
      })
    );
  }

  private ngAfterViewInit() {


    

    ///CAMBIO DE FOCO
    this.val.addFocus("txtCliente", "txtNombre", undefined);
    this.val.addFocus("txtNombre", "txtIdentificacion", undefined);
    this.val.addFocus("txtIdentificacion", "txtContacto", undefined);
    this.val.addFocus("txtContacto", "txtBodega", undefined);
    this.val.addFocus("txtBodega", "txtVendedor", undefined);
    this.val.addFocus("txtVendedor", "txtOC", undefined);
    this.val.addFocus("txtOC", "btnSiguiente", "click");






    //HABILITANDO CHECKBOK POR PROBLEMAS DE VIZUALIZACION
    let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
    lstcheckbox.forEach((f: any) => {
      if (f.id != "chkDelivery") {
        f.bootstrapToggle();
      }
    });
  }
}
