import { Component, ViewChild } from "@angular/core";
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
  VerticalAlignment,
  scaleInCenter,
  scaleOutCenter,
} from "igniteui-angular";
import { iBodega } from "../../interface/i-Bodega";
import { iCredito } from "../../interface/i-Credito";
import { iVendedor } from "../../interface/i-venedor";
import { FactConfirmarComponent } from "./fact-confirmar/fact-confirmar.component";
import { Funciones } from "src/app/SHARED/class/cls_Funciones";
import { FactFichaProductoComponent } from "./fact-ficha-producto/fact-ficha-producto.component";
import { iDetalleFactura } from "../../interface/i-detalle-factura";
import { FactRevisionComponent } from "./fact-revision/fact-revision.component";
import { postFactura } from "../../POST/post-factura";

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

  lstBodega: iBodega[] = [];
  lstVendedores: iVendedor[] = [];

  public Panel: string = "";
  public BotonSiguienteLabel = "";

  public TipoPago: string = "Contado";
  public TipoImpuesto: string = "Iva";
  public Plazo: number = 0;
  public EsContraEntrega: boolean = false;
  public EsExportacion: boolean = false;
  public isEvent: boolean = false;
  private bol_Referescar: boolean = false;
  private Disponible : number = 0;

  public SimboloMonedaCliente: string = "U$";
  private MonedaCliente: string;

  constructor(
    private dialog: MatDialog,
    private cFunciones: Funciones,
    private Conexion: getFactura,
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
        this.Panel = "";
        this.bol_Referescar = false;
        this.Plazo = 0;
        this.SimboloMonedaCliente = "U$";
        this.CodBodega = "B-01";
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
        this.val.Get("txtCliente").enable();
        this.val.Get("txtLimite").disable();
        this.val.Get("txtDisponible").disable();

        let _iBodega  = this.lstBodega.find(f => f.Codigo == this.CodBodega);

        if(_iBodega != undefined)
        {
          let cl = this.lstClientes.find((f) => f.Codigo == _iBodega?.ClienteContado);

          if (cl != undefined) {
            this.CodCliente = cl.Codigo;
            this.MonedaCliente = cl.Moneda;
            this.val.Get("txtCliente").setValue(cl.Cliente);
            this.val.Get("txtVendedor").setValue([_iBodega.Vendedor]);
            this.val.Get("txtCliente").disable();
            this.MonedaCliente = cl.Moneda;
            this.SimboloMonedaCliente = "U$";
            if (cl.Moneda == "C") this.SimboloMonedaCliente = "C$";
            
          }
        }

        

        break;
    }
  }

  private CargarDatos(): void {
    document
      .getElementById("btnRefrescar")
      ?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.Conexion.Datos_Factura().subscribe(
      (s) => {
        document.getElementById("btnRefrescar")?.removeAttribute("disabled");
        dialogRef.close();
        let _json = JSON.parse(s);
     
        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos[] = _json["d"];

          this.lstClientes = Datos[0].d;
          this.lstBodega = Datos[1].d;
          this.lstVendedores = Datos[2].d;

          let _iBodega  = this.lstBodega.find(f => f.Codigo == this.CodBodega);


          this.cmbBodega.setSelectedItem(this.CodBodega);


          if (this.CodCliente == "" && _iBodega != undefined) {
            let cl = this.lstClientes.find((f) => f.Codigo == _iBodega?.ClienteContado);

            if (cl != undefined) {
              this.CodCliente = cl.Codigo;
              this.MonedaCliente = cl.Moneda;
              this.val.Get("txtCliente").setValue(cl.Cliente);
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
      (err) => {
        document.getElementById("btnRefrescar")?.removeAttribute("disabled");
        dialogRef.close();

        this.dialog.open(DialogErrorComponent, {
          data: "<b class='error'>" + err.message + "</b>",
        });
      }
    );
  }

  public v_Refrescar(): void {
    this.bol_Referescar = true;
    this.CargarDatos();
  }

  //████████████████████████████████████████████DATOS CLIENTE████████████████████████████████████████████████████████████████████████

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

    this.LlenarDatosCliente(event.option.value);
  }

  public v_Borrar_Cliente(): void {
    this.CodCliente = "";
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
      this.val.Get("txtCliente").setValue(Cliente[0].Cliente);
      this.val
        .Get("txtIdentificacion")
        .setValue(Cliente[0].Ruc + "/" + Cliente[0].Cedula);
      this.val
        .Get("txtLimite")
        .setValue(this.cFunciones.NumFormat(Cliente[0].Limite, "2"));
      this.val.Get("txtContacto").setValue(Cliente[0].Contacto);
      this.val.Get("txtDisponible").setValue("0.00");

      if (this.val.Get("txtVendedor").value == "" || Cliente[0].EsClave) {
        this.cmbVendedor.setSelectedItem(Cliente[0].CodVendedor);
        this.val.Get("txtVendedor").setValue([Cliente[0].CodVendedor]);

        let index: number = this.lstVendedores.findIndex(
          (f) => f.Codigo == Cliente[0].CodVendedor
        );

        if (index == -1) {
          this.dialog.open(DialogErrorComponent, {
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
      event.newSelection = event.added;
      this.val.Get("txtBodega").setValue(event.added);
      this.CodBodega = event.added[0];
      this.FichaProducto.lstDetalle.splice(
        1,
        this.FichaProducto.lstDetalle.length
      );
    }
  }

  public v_Enter_Bodega(event: any) {
    if (event.key == "Enter") {
      let _Item: iBodega = this.cmbBodega.dropdown.focusedItem.value;
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

  public v_Close_Vendedor() {
    // this.f_key_Enter(this.cmbVendedor.id);
  }

  private v_EsClienteClave(CodNewVend: string): void {
    if (CodNewVend == "") return;

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        
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

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.Plazo = 0;
    this.Conexion.Datos_Credito(this.CodCliente).subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
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

              if(this.ConfirmarFactura.Vizualizado)
              {
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
              this.dialog.open(DialogErrorComponent, {
                data: "<b class='error'>No tiene crédito disponible.</b>",
              });
            }
          } else {
            this.TipoPago = "Contado";
            chk.bootstrapToggle("off");

            this.dialog.open(DialogErrorComponent, {
              data: "<b class='error'>No tiene crédito asignado.</b>",
            });
          }
        }
      },
      (err) => {
        dialogRef.close();
        this.TipoPago = "Contado";
        chk.bootstrapToggle("off");

        this.dialog.open(DialogErrorComponent, {
          data: "<b class='error'>" + err.message + "</b>",
        });
      }
    );
  }

  public v_TipoImpuesto(event: any): void {

    if(this.isEvent){
      this.isEvent = false;
      return;
    }
    this.isEvent = true;

    let chk: any = document.querySelector("#chkImpuesto");

    if( this.ConfirmarFactura.TipoExoneracion == "Sin Exoneración")
    {
      chk.bootstrapToggle("on");
    }
    else{
     
      chk.bootstrapToggle("off")
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
    this.EsExportacion = event.target.checked;
  }

  public v_FichaPanel(evento: string): void {
    this.val.EsValido();

    if (this.val.Errores != "") {
      this.dialog.open(DialogErrorComponent, {
        data: this.val.Errores,
      });

      return;
    }

    if (this.CodCliente == "") {
      this.dialog.open(DialogErrorComponent, {
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
        if (this.ConfirmarFactura.TipoExoneracion == "Sin Exoneración") {
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

      if(evento == "Atras")
      {
        this.FichaProducto.lstDetalle = this.ConfirmarFactura.lstDetalle;
        this.FichaProducto.TC = this.ConfirmarFactura.TC;
        this.MonedaCliente = this.ConfirmarFactura.MonedaCliente;
        this.TipoPago = this.ConfirmarFactura.TipoPago;
        this.Disponible = this.ConfirmarFactura.Disponible;
        this.val.Get("txtDisponible").setValue(this.cFunciones.NumFormat(this.ConfirmarFactura.Disponible, "2"));
        if(this.TipoPago == "Credito") this.val.Get("txtDisponible").setValue(this.cFunciones.NumFormat(this.ConfirmarFactura.Restante, "2") );
     
      }

      this.LlenarRevision();

      return;
    }

    if (evento == "Siguiente" && this.Panel == "Revision") {
      this.Panel = "Confirmar";
      this.BotonSiguienteLabel = "Facturar";

      (
        document.querySelector("#frmConfirmarFactura") as HTMLElement
      ).setAttribute("style", "display:initial;");

      this.LlenarDatosConfirmacion();

      return;
    }

    if (evento == "Siguiente" && this.Panel == "Confirmar") {
      this.Panel = "Confirmar";
      this.BotonSiguienteLabel = "Facturar";

      
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
      this.ConfirmarFactura.TipoExoneracion
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
      this.ConfirmarFactura.TipoExoneracion
    );
  }

  //████████████████████████████████████████████CONFIRMAR FACTURA████████████████████████████████████████████████████████████████████

  @ViewChild("ConfirmarFactura", { static: false })
  public ConfirmarFactura: FactConfirmarComponent;

  private LlenarDatosConfirmacion(): void {
    this.ConfirmarFactura.lstBodega = this.lstBodega;
    this.ConfirmarFactura.lstVendedores = this.lstVendedores;
    this.ConfirmarFactura.Iniciar(
      this.CodBodega,
      this.CodCliente,
      this.Plazo,
      this.val.Get("txtCliente").value,
      this.val.Get("txtNombre").value,
      this.val.Get("txtVendedor").value[0],
      this.MonedaCliente,
      this.TipoPago,
      this.RevisionFactura.TC,
      this.RevisionFactura.lstDetalle
    );
  }



  public v_Guardar() : void{

    let ErrorFicha : string = "";
    let ErrorConfirmar : string = "";
    let ErrorOtros : string = "";

    this.val.EsValido();
    this.ConfirmarFactura.val.EsValido();

    ErrorFicha = this.val.Errores;
    ErrorConfirmar = this.ConfirmarFactura.val.Errores;




    if (ErrorFicha != "") {
      this.dialog.open(DialogErrorComponent, {
        data: ErrorFicha,
      });

      return;
    }

    if (ErrorConfirmar != "") {
      this.dialog.open(DialogErrorComponent, {
        data: ErrorConfirmar,
      });

      return;
    }

    if(this.ConfirmarFactura.TipoPago == "Credito")
    {
      let Total : number = 0;
      let Restante : number = 0;
      Total = this.cFunciones.Redondeo(this.ConfirmarFactura.TotalDolar, "2");
      if(this.MonedaCliente == "C")  Total = this.cFunciones.Redondeo(this.ConfirmarFactura.TotalCordoba, "2");

      Restante = this.cFunciones.Redondeo(this.ConfirmarFactura.Disponible - Total, "2");
      

      if( Restante < 0) ErrorOtros += "<li class='error-etiqueta'>Disponible<ul><li class='error-mensaje'>No tiene disponible.</li></ul>";
    }

    if( this.RevisionFactura.lstDetalle.length == 0) ErrorOtros += "<li class='error-etiqueta'>Productos<ul><li class='error-mensaje'>Registre al menos un producto para facturar.</li></ul>";


    if(ErrorOtros != "")
    {
      this.dialog.open(DialogErrorComponent, {
        data:
          "<ul>"+ErrorOtros+"</ul>",
      });

      return;
  
    }


   
    this.POST.GuardarFactura("").subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } 
        else {

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
      (err) => {
        dialogRef.close();
      
        this.dialog.open(DialogErrorComponent, {
          data: "<b class='error'>" + err.message + "</b>",
        });
      }
    );

    
    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );




    



  }

  private ngOnInit() {


    ///CAMBIO DE FOCO
    this.val.addFocus("txtCliente", "txtNombre", undefined);
    this.val.addFocus("txtNombre", "txtIdentificacion", undefined);
    this.val.addFocus("txtIdentificacion", "txtContacto", undefined);
    this.val.addFocus("txtContacto", "txtOC", undefined);
    this.val.addFocus("txtOC", "btnSiguiente", "click");




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
    //HABILITANDO CHECKBOK POR PROBLEMAS DE VIZUALIZACION
    let lstcheckbox: any = document.querySelectorAll("input[type='checkbox']");
    lstcheckbox.forEach((f: any) => {
      if (f.id != "chkDelivery") {
        f.bootstrapToggle();
      }
    });
  }
}
