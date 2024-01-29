import { Component, ViewChild } from "@angular/core";
import { TablaDatosComponent } from "../../tabla-datos/tabla-datos.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable, map, startWith } from "rxjs";
import { FactBonificacionLibreComponent } from "../fact-bonificacion-libre/fact-bonificacion-libre.component";
import { iProducto } from "src/app/FAC/interface/i-Producto";
import { Validacion } from "src/app/SHARED/class/validacion";
import { getFactura } from "src/app/FAC/GET/get-factura";
import { WaitComponent } from "src/app/SHARED/componente/wait/wait.component";
import { DialogErrorComponent } from "src/app/SHARED/componente/dialog-error/dialog-error.component";
import { iDatos } from "src/app/SHARED/interface/i-Datos";
import { iPrecio } from "src/app/FAC/interface/i-Precio";
import { Funciones } from "src/app/SHARED/class/cls_Funciones";
import { iDetalleFactura } from "src/app/FAC/interface/i-detalle-factura";
import { iExistencia } from "src/app/FAC/interface/i-Existencia";
import { iBonificacion } from "src/app/FAC/interface/i-Bonificacion";
import { iDescuento } from "src/app/FAC/interface/i-Descuento";
import { IgxComboComponent, OverlaySettings } from "igniteui-angular";

@Component({
  selector: "app-fact-ficha-producto",
  templateUrl: "./fact-ficha-producto.component.html",
  styleUrls: ["./fact-ficha-producto.component.scss"],
})
export class FactFichaProductoComponent {
  public val = new Validacion();

  public Detalle: iDetalleFactura;
  public lstDetalle: iDetalleFactura[] = [];

  private MonedaCliente: string;
  public CodCliente: string = "";
  public TC: number = 0;
  private bol_Referescar: boolean = false;
  private bol_BonificacionLibre = false;
  private bol_EsPrecioLiberado = false;
  private bol_Exportacion = false;


  public CodProducto: string = "";
  private i_Bonif: any = undefined;
  public CodBodega: string = "";
  lstProductos: iProducto[] = [];
  filteredProductos: Observable<iProducto[]> | undefined;

  private lstPrecios: iPrecio[] = [];
  private lstExistencia: iExistencia[] = [];
  private lstBonificacion: iBonificacion[] = [];
  private lstDescuento: iDescuento[] = [];
  public TipoExoneracion: string;

  public SubTotal: number = 0;
  public Descuento: number = 0;
  public Adicional: number = 0;
  public SubTotalNeto: number = 0;
  public Impuesto: number = 0;
  public TotalCordoba: number = 0;
  public TotalDolar: number = 0;

  private EsModal : boolean = false;

  public overlaySettings: OverlaySettings = {};

  public constructor(
    private GET: getFactura,
    public cFunciones: Funciones
  ) {
    this.val.add(
      "txtCodProducto",
      "1",
      "LEN>",
      "0",
      "CodProducto",
      "Seleccione un producto."
    );
    this.val.add("txtProducto", "1", "LEN>=", "0", "Producto", "");
    this.val.add(
      "txtPrecioCor",
      "1",
      "NUM>=",
      "0",
      "Precio Cordoba",
      "Ingrese  precio cordoba."
    );
    this.val.add(
      "txtPrecioDol",
      "1",
      "NUM>=",
      "0",
      "Precio Dolar",
      "Ingrese  precio dolar."
    );
    this.val.add(
      "txtCantidad",
      "1",
      "NUM>",
      "0",
      "Cantidad",
      "Ingrese una cantidad valida."
    );
    this.val.add(
      "txtProcDescuento",
      "1",
      "NUM>=",
      "0",
      "% Descuento",
      "Ingrese un descuento valido."
    );

    this._Evento("Limpiar");
  }

  public Iniciar(CodBodega: string, CodCliente: string, MonedaCliente: string, TipoExoneracion: string, Exportacion: boolean, EsModal : boolean): void {
    this._Evento("Limpiar");
    this.CodBodega = CodBodega;
    this.CodCliente = CodCliente;
    this.MonedaCliente = MonedaCliente;
    this.TipoExoneracion = TipoExoneracion;
    this.bol_Exportacion = Exportacion;
    this.EsModal = EsModal;

    document.getElementById("btnAgregarProducto")?.setAttribute("disabled", "disabled");

    this.v_Cargar_Productos();
  }

  public _Evento(e: string): void {
    switch (e) {
      case "Limpiar":

        this.Detalle = {} as iDetalleFactura;
        this.bol_Referescar = false;
        this.bol_BonificacionLibre = false;
        this.bol_EsPrecioLiberado = false;
        this.i_Bonif = undefined;
        this.CodProducto = "";
        this.val.Get("txtCodProducto").setValue("");
        this.val.Get("txtProducto").setValue("");
        this.val.Get("txtPrecioCor").setValue("0.0000");
        this.val.Get("txtPrecioDol").setValue("0.0000");
        this.val.Get("txtCantidad").setValue("1");
        this.val.Get("txtProcDescuento").setValue("0.00");

        this.val.Get("txtCodProducto").enable();
        this.val.Get("txtProducto").enable();
        this.val.Get("txtPrecioCor").disable();
        this.val.Get("txtPrecioDol").disable();
        this.val.Get("txtProcDescuento").disable();
        this.val.Get("txtCantidad").disable();

        this.SubTotal = 0;
        this.Descuento = 0;
        this.SubTotalNeto = 0;
        this.Impuesto = 0;
        this.TotalCordoba = 0;
        this.TotalDolar = 0;

        document.getElementById("btnAgregarProducto")?.setAttribute("disabled", "disabled");
        document?.getElementById("txtCodProducto")?.focus();

        break;
    }
  }

  public v_Refrescar(): void {
    this.bol_Referescar = true;
    this.v_Cargar_Productos();
  }

  //████████████████████████████████████████████FICHA PRODUCTO████████████████████████████████████████████████████████████████████████
  @ViewChild("cmbProducto", { static: false })
  public cmbProducto: IgxComboComponent;
  
  private v_Cargar_Productos(): void {

    this.lstPrecios.splice(0, this.lstPrecios.length);
    this.lstExistencia.splice(0, this.lstExistencia.length);
    this.lstBonificacion.splice(0, this.lstBonificacion.length);

    document
      .getElementById("btnRefrescarProductos")
      ?.setAttribute("disabled", "disabled");

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.Cargar_Productos().subscribe(
      {
        next: (s) => {

          document
            .getElementById("btnRefrescarProductos")
            ?.removeAttribute("disabled");
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

            this.lstProductos = Datos[0].d;
            this.TC = Datos[1].d;



            //LLENAR DATOS AL REFRESCAR
            if (this.bol_Referescar) {

              if (this.CodProducto != "" && this.CodBodega != "") this.v_Datos_Producto();
              this.bol_Referescar = false;
            }
          }

        },
        error: (err) => {
          document
            .getElementById("btnRefrescarProductos")
            ?.removeAttribute("disabled");
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


  public v_Select_Producto(event: any): void {


    if (event.added.length) {
      if (event.newValue.length > 1) event.newValue.splice(0, 1);

      let _Item: iProducto = this.cmbProducto.dropdown.focusedItem.value;


      this.CodProducto = "";
      this.bol_EsPrecioLiberado = false;
      this.val.Get("txtProducto").setValue("");
      this.val.Get("txtPrecioCor").setValue("0.0000");
      this.val.Get("txtPrecioDol").setValue("0.0000");
      this.val.Get("txtCantidad").setValue("1");
      this.val.Get("txtProcDescuento").setValue("0.00");


      this.CodProducto = _Item.Codigo;
      this.val.Get("txtProducto").setValue(_Item.Producto);
      this.val.Get("txtCodProducto").disable();
      this.val.Get("txtProducto").disable();
      //this.val.Get("txtPrecioCor").enable();
      //this.val.Get("txtPrecioDol").enable();
      this.val.Get("txtProcDescuento").enable();
      this.val.Get("txtCantidad").enable();

      //document?.getElementById("txtPrecioCor")?.focus();

      this.v_Datos_Producto();


    }




  }

  public v_Enter_Producto(event: any) {
    if (event.key == "Enter") {
      let _Item: iProducto = this.cmbProducto.dropdown.focusedItem.value;
      this.cmbProducto.setSelectedItem(_Item.Codigo);
      this.val.Get("txtCodProducto").setValue([_Item.Codigo]);
      this.CodProducto = _Item.Codigo;
    }
  }

  public v_Close_Producto() {
    this.CodProducto = this.cmbProducto.value[0];
  }


  private LlenarPrecio(): void {


    this.val.Get("txtPrecioCor").disable();
    this.val.Get("txtPrecioDol").disable();


    let PrecioProd: iPrecio[] = this.lstPrecios.filter(
      (f) => f.EsPrincipal
    );


    if (PrecioProd.length > 0) {
      this.val
        .Get("txtPrecioCor")
        .setValue(this.cFunciones.NumFormat(PrecioProd[0].PrecioCordoba, "4"));
      this.val
        .Get("txtPrecioDol")
        .setValue(this.cFunciones.NumFormat(PrecioProd[0].PrecioDolar, "4"));

      this.bol_EsPrecioLiberado = PrecioProd[0].Liberado;
      if (this.bol_EsPrecioLiberado) {
        this.val.Get("txtPrecioCor").enable();
        this.val.Get("txtPrecioDol").enable();
        document?.getElementById("txtPrecioCor")?.focus();
      }
      else {
        document?.getElementById("txtCantidad")?.focus();
      }



    }

    this.Calcular();

    document.getElementById("btnAgregarProducto")?.removeAttribute("disabled");
  }

  private v_Datos_Producto(): void {

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.Datos_Producto(this.CodProducto, this.CodBodega, this.CodCliente).subscribe(
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
  
            this.lstExistencia = Datos[0].d;
            this.lstBonificacion = Datos[1].d;
            this.lstPrecios = Datos[2].d;
            this.lstDescuento = Datos[3].d;
  
  
            this.lstExistencia.filter(f => f.Bodega == this.CodBodega && f.CodProducto == this.CodProducto).forEach(f => {
  
              let CantFact: number = this.lstDetalle.filter(item => item.Codigo === f.CodProducto).reduce((sum, current) => sum + current.Cantidad, 0);
              f.Existencia = this.cFunciones.Redondeo(f.Existencia - CantFact, "0");
            });
  
            this.lstPrecios.forEach((f) => {
              f.PrecioCordoba = this.cFunciones.Redondeo(f.PrecioCordoba, "4");
              f.PrecioDolar = this.cFunciones.Redondeo(f.PrecioDolar, "4");
            });
  
  
            this.LlenarPrecio();
            if (this.bol_BonificacionLibre) this.v_Agregar_Producto();
  
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



  public v_Borrar_Producto(): void {
    this.CodProducto = "";
    this.cmbProducto.setSelectedItem([]);
    this.bol_EsPrecioLiberado = false;
    this.lstPrecios.splice(0, this.lstPrecios.length);
    this.lstBonificacion.splice(0, this.lstBonificacion.length);
    this.lstExistencia.splice(0, this.lstExistencia.length);
    this.val.Get("txtCodProducto").setValue("");
    this.val.Get("txtProducto").setValue("");
    this.val.Get("txtPrecioCor").setValue("0.0000");
    this.val.Get("txtPrecioDol").setValue("0.0000");
    if (!this.bol_BonificacionLibre) this.val.Get("txtCantidad").setValue("1");
    this.val.Get("txtProcDescuento").setValue("0.00");

    this.val.Get("txtCodProducto").enable();
    this.val.Get("txtProducto").enable();
    this.val.Get("txtPrecioCor").disable();
    this.val.Get("txtPrecioDol").disable();
    this.val.Get("txtProcDescuento").disable();
    this.val.Get("txtCantidad").disable();



    this.SubTotal = 0;
    this.Descuento = 0;
    this.Adicional = 0;
    this.SubTotalNeto = 0;
    this.Impuesto = 0;
    this.TotalCordoba = 0;
    this.TotalDolar = 0;

    document.getElementById("btnAgregarProducto")?.setAttribute("disabled", "disabled");

    if (this.bol_BonificacionLibre) {
      this.v_Bonificacion_Libre();
    }
    else {
      document?.getElementById("txtCodProducto")?.focus();
    }




  }

  public v_tabla_Producto(p: string): void {

    if (this.CodProducto == "") return;

    let data: any;


    if (p == "E") data = this.lstExistencia;
    if (p == "B") data = this.lstBonificacion;
    if (p == "P") data = this.lstPrecios;
    if (p == "D") data = this.lstDescuento;


    let dialogRef: MatDialogRef<TablaDatosComponent> = this.cFunciones.DIALOG.open(
      TablaDatosComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "",
        data: [p, data],
      }
    );


  }

  public v_FocusOut(id: string, decimal: string): void {
    this.val
      .Get(id)
      .setValue(this.cFunciones.NumFormat(this.val.Get(id).value.replaceAll(",", ""), decimal));
  }

  public v_ConvertirPrecio(event: any): void {
    if (event.target.value == "") return;
    let valor: number = Number(String(event.target.value).replaceAll(",", ""));

    if (event.target.id == "txtPrecioCor") {
      valor = valor / this.TC;
      this.val
        .Get("txtPrecioDol")
        .setValue(this.cFunciones.NumFormat(valor, "4"));
    }

    if (event.target.id == "txtPrecioDol") {
      valor = valor * this.TC;
      this.val
        .Get("txtPrecioCor")
        .setValue(this.cFunciones.NumFormat(valor, "4"));
    }

    this.Calcular();

  }

  public v_Bonificacion_Libre(): void {
    let dialogRef: MatDialogRef<FactBonificacionLibreComponent> =
      this.cFunciones.DIALOG.open(FactBonificacionLibreComponent, {
        panelClass: "escasan-dialog-full",//window.innerWidth < 992 ? "escasan-dialog-full" : "",
        data: this.lstProductos,
        disableClose: true
      });

    dialogRef.afterOpened().subscribe(s => {


      if (this.bol_BonificacionLibre) {
        this.bol_BonificacionLibre = false;

        dialogRef.componentInstance.valBonif.Get("txtCantidadBonif").setValue(this.val.Get("txtCantidad").value);
        this.val.Get("txtCantidad").setValue("1");
        dialogRef.componentInstance.v_ForzarSeleccionar(this.i_Bonif.Codigo);
        this.i_Bonif = undefined;

      }
    });


    dialogRef.afterClosed().subscribe(s => {

      if (dialogRef.componentInstance.i_Bonif != undefined) {
        this.i_Bonif = dialogRef.componentInstance.i_Bonif;
        this.CodProducto = this.i_Bonif.Codigo;
        this.val.Get("txtCodProducto").setValue(this.i_Bonif.Producto)
        this.val.Get("txtCantidad").setValue(dialogRef.componentInstance.valBonif.Get("txtCantidadBonif").value);
        this.bol_BonificacionLibre = true;
        this.v_Datos_Producto();
      }
      else {
        this.bol_BonificacionLibre = false;
        this.i_Bonif = undefined;
      }

    });

  }



  public v_Agregar_Producto(): void {

    let MsjError: string = "";
    let index: number = 1;
    let det: iDetalleFactura = JSON.parse(JSON.stringify(this.Detalle));
    let Existencia = this.lstExistencia.find(f => f.Bodega == this.CodBodega && f.CodProducto == this.CodProducto);
    let Bonificado = this.lstBonificacion.find(f => det.Cantidad <= f.Hasta && det.Cantidad >= f.Desde);
    let AgregarBonificado: boolean = false;
    let DetalleBonificado: iDetalleFactura = {} as iDetalleFactura;
    let Descuento = this.lstDescuento.find(f => f.Descripcion == "GENERAL");
    let PrecioProd = this.lstPrecios.find(f => f.CodProducto == this.CodProducto && f.EsPrincipal);

    if (Descuento == undefined) Descuento = this.lstDescuento.find(f => f.Descripcion == "MARGEN");
    if (Descuento != undefined) {
      if (Descuento.PorcDescuento == 0) Descuento = this.lstDescuento.find(f => f.Descripcion == "MARGEN");
    }



    if (this.lstDetalle.length > 0) index = Math.max(...this.lstDetalle.map(o => o.Index)) + 1

    det.Index = index;
    det.IndexUnion = index;

    this.val.EsValido();

    if (det.Precio == 0) MsjError += "<li class='error-etiqueta'>Precio<ul><li class='error-mensaje'>El producto no tiene precio.</li></ul>";
    if (det.PorcDescuento > 100) MsjError += "<li class='error-etiqueta'>Descuento<ul><li class='error-mensaje'>Por favor revise el descuento.</li></ul>";

	if (Existencia == undefined) MsjError += "<li class='error-etiqueta'>Existencia<ul><li class='error-mensaje'>El producto no tiene existencia.</li></ul>";
    if (Existencia != undefined )if (Number(Existencia?.Existencia) <= 0) MsjError += "<li class='error-etiqueta'>Existencia<ul><li class='error-mensaje'>El producto no tiene existencia.</li></ul>";
    if (Existencia != undefined )if (Number(Existencia?.Existencia) > 0 && Number(Existencia?.Existencia) < det.Cantidad) MsjError += "<li class='error-etiqueta'>Cantidad<ul><li class='error-mensaje'>La cantidad supera la existencia. " + this.cFunciones.NumFormat(Number(Existencia?.Existencia), "0") + "</li></ul>";

    if (Descuento == undefined && det.PorcDescuento != 0) MsjError += "<li class='error-etiqueta'>Descuento<ul><li class='error-mensaje'>No se permite el descuento.</li></ul>";
    if (Descuento != undefined) {
      if (this.cFunciones.Redondeo(Descuento.PorcDescuento / 100, "4") < det.PorcDescuento) MsjError += "<li class='error-etiqueta'>Descuento<ul><li class='error-mensaje'>El descuento permitido es max: <b>" + Descuento.PorcDescuento + "%</b></li></ul>";
    }

    if (PrecioProd == undefined) {
      MsjError += "<li class='error-etiqueta'>Precio<ul><li class='error-mensaje'>El producto no tiene precio.</li></ul>";
    }
    else {
      if (PrecioProd!.PrecioCordoba != det.PrecioCordoba && !PrecioProd!.Liberado) MsjError += "<li class='error-etiqueta'>Precio<ul><li class='error-mensaje'>No tiene permiso para modificar precio..</li></ul>";
    }

    if (Bonificado != undefined && !this.bol_BonificacionLibre) {
      if (Bonificado.Bonifica + det.Cantidad <= Number(Existencia?.Existencia)) {

        index += 1;
        DetalleBonificado.IdVentaDetalle = "00000000-0000-0000-0000-000000000000";
        DetalleBonificado.IdVenta = "00000000-0000-0000-0000-000000000000";
        DetalleBonificado.Index = index;
        DetalleBonificado.Codigo = this.CodProducto;
        DetalleBonificado.Producto = det.Producto;
        DetalleBonificado.Precio = 0;//det.Precio;
        DetalleBonificado.PrecioCordoba = 0;//det.PrecioCordoba;
        DetalleBonificado.PrecioDolar = 0;//det.PrecioDolar;
        DetalleBonificado.PorcDescuento = 0;//1;
        DetalleBonificado.PorcDescuentoAdicional = 0;
        DetalleBonificado.PorcImpuesto = det.PorcImpuesto;
        DetalleBonificado.Cantidad = Bonificado.Bonifica;
        DetalleBonificado.SubTotal = 0;
        DetalleBonificado.Descuento = 0;
        DetalleBonificado.SubTotalNeto = 0;
        DetalleBonificado.Impuesto = 0;
        DetalleBonificado.ImpuestoExo = 0;
        DetalleBonificado.TotalCordoba = 0;
        DetalleBonificado.TotalDolar = 0;
        DetalleBonificado.EsBonif = true;
        DetalleBonificado.EsBonifLibre = false;
        DetalleBonificado.EsExonerado = false;
        DetalleBonificado.EsExento = false;
        if(this.bol_Exportacion)  DetalleBonificado.EsExento = true;
        DetalleBonificado.PrecioLiberado = false;
        DetalleBonificado.Margen = 0;
        DetalleBonificado.PedirAutorizado = false;
        DetalleBonificado.Autorizado = false;
        DetalleBonificado.IndexUnion = det.Index;
        DetalleBonificado.UsuarioAutoriza = "";

        AgregarBonificado = true;

      }
    }




    if (MsjError != "" || this.val.Errores) {

      if (this.bol_BonificacionLibre) {
        this.SubTotal = 0;
        this.Descuento = 0;
        this.Adicional = 0;
        this.SubTotalNeto = 0;
        this.Impuesto = 0;
        this.TotalCordoba = 0;
        this.TotalDolar = 0;
      }



      let Ref = this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data:
          "<ul>" + MsjError + "</ul>" + this.val.Errores,
      });


      if (this.bol_BonificacionLibre) {
        Ref.afterClosed().subscribe(s => {
          this.v_Borrar_Producto();

        });

      }
      return;

    }


    if (this.bol_BonificacionLibre) {
      det.PorcDescuento = 1;
      det.SubTotal = 0;
      det.Descuento = 0;
      det.SubTotalNeto = 0;
      det.Impuesto = 0;
      det.ImpuestoExo = 0;
      det.TotalCordoba = 0;
      det.TotalDolar = 0;
      det.EsBonif = true;
      det.EsBonifLibre = true;
      det.EsExonerado = false;
      det.EsExento = false;
      if(this.bol_Exportacion)  DetalleBonificado.EsExento = true;
      det.PrecioLiberado = false;
      det.PedirAutorizado = false;
      det.Autorizado = false;
      det.UsuarioAutoriza = "";
      det.Margen = 0;
      this.bol_BonificacionLibre = false;
      this.i_Bonif = undefined;

      this.SubTotal = 0;
      this.Descuento = 0;
      this.Adicional = 0;
      this.SubTotalNeto = 0;
      this.Impuesto = 0;
      this.TotalCordoba = 0;
      this.TotalDolar = 0;
    }
    else
    {
      det.PedirAutorizado = false;
      det.UsuarioAutoriza = "";
      if(det.Autorizado == undefined) det.Autorizado = false;

      if (AgregarBonificado && det.Descuento == 0){
        let PrecioDist  = this.lstPrecios.find(f => f.CodProducto == this.CodProducto && f.Tipo.includes("Distribuid"));

        det.Margen = this.cFunciones.Redondeo(det.Cantidad * det.PrecioCordoba, "2");
        det.Margen = this.cFunciones.Redondeo(det.Margen / DetalleBonificado.Cantidad, "2");
        if(det.Margen < Number(PrecioDist?.PrecioCordoba) && !this.EsModal) det.PedirAutorizado = true;

      }
     
    }


 
    

    this.lstDetalle.push(det);
    if (AgregarBonificado && det.Descuento == 0) this.lstDetalle.push(DetalleBonificado);

    this._Evento("Limpiar");
  }

  public v_minus_mas(s: string, id: string): void {

    if (this.CodProducto == "") return;
    let valor: string = this.val.Get(id).value;

    if (valor == "" || valor == undefined) valor = "0";

    let num: number = Number(valor.replaceAll(",", ""))

    if (s == "+") num += 1;

    if (s == "-") num -= 1;

    this.val.Get(id).setValue(this.cFunciones.NumFormat(num, (id == "txtCantidad" ? "0" : "2")));

    this.Calcular();
  }

  public Calcular(): void {

    this.Detalle = {} as iDetalleFactura;
    let iDesc = this.lstDescuento.find(f => f.Descripcion == "ADICIONAL");
    

    this.SubTotal = 0;
    this.Descuento = 0;
    this.Adicional = 0;
    this.SubTotalNeto = 0;
    this.Impuesto = 0;
    this.TotalCordoba = 0;
    this.TotalDolar = 0;

    if (this.CodProducto == "") return;

    let iPrec = this.lstPrecios.find(f => f.EsPrincipal && f.CodProducto == this.CodProducto);


    let Producto: iProducto[] = this.lstProductos.filter(
      (f) => f.Codigo == this.CodProducto
    );

    if (Producto.length == 0) return;


    let PrecioCordoba: number = Number(String(this.val.Get("txtPrecioCor").value).replaceAll(",", ""));
    let PrecioDolar: number = Number(String(this.val.Get("txtPrecioDol").value).replaceAll(",", ""));
    let Cantidad: number = Number(this.val.Get("txtCantidad").value.replaceAll(",", ""));
    let PorDescuento: number = Number(String(this.val.Get("txtProcDescuento").value.replaceAll(",", ""))) / 100;
    let PorcDescuentoAdicional: number = this.cFunciones.Redondeo(Number(iDesc?.PorcDescuento) / 100, "4");
    let PorcImpuesto: number = Producto[0].ConImpuesto ? 0.15 : 0;
    let ImpuestoExo: number = 0;
    let CambioPrecio : boolean = false;

    if (PorcDescuentoAdicional == undefined) PorcDescuentoAdicional = 0;
    if (PorDescuento == undefined) PorDescuento = 0;
    if (PorcImpuesto == undefined) PorcImpuesto = 0.15;
    if (PrecioCordoba == undefined) PrecioCordoba = 0;
    if (PrecioDolar == undefined) PrecioDolar = 0;


    this.Detalle.Precio = PrecioCordoba;
    this.Detalle.PorcDescuento = this.cFunciones.Redondeo(PorDescuento * 100, "2");


    if (Cantidad == 0 || PrecioCordoba == 0 || PrecioDolar == 0) return;
    if (this.TC == 0) this.TC = 1;

    if (this.cFunciones.MonedaLocal == this.MonedaCliente) {

      if(iPrec?.PrecioCordoba != PrecioCordoba) CambioPrecio = true;


      this.SubTotal = this.cFunciones.Redondeo(PrecioCordoba * Cantidad, "2");
      this.Descuento = this.cFunciones.Redondeo(
        this.SubTotal * PorDescuento,
        "2"
      );

      this.Adicional = this.cFunciones.Redondeo(this.cFunciones.Redondeo(this.SubTotal - this.Descuento, "2") * PorcDescuentoAdicional, "2");



      this.SubTotalNeto = this.cFunciones.Redondeo(this.SubTotal - (this.Descuento + this.Adicional), "2");
      this.Impuesto = this.cFunciones.Redondeo(
        this.SubTotalNeto * PorcImpuesto,
        "2"
      );

      ImpuestoExo = 0;
      if (this.TipoExoneracion == "Exonerado" || this.bol_Exportacion) {
        ImpuestoExo = this.Impuesto;
        this.Impuesto = 0;
      }


      this.TotalCordoba = this.cFunciones.Redondeo(this.SubTotalNeto + this.Impuesto, "2");
      this.TotalDolar = this.cFunciones.Redondeo(
        this.TotalCordoba / this.TC,
        "2"
      );
    } else {

      if(iPrec?.PrecioDolar != PrecioDolar) CambioPrecio = true;


      this.SubTotal = this.cFunciones.Redondeo(PrecioDolar * Cantidad, "2");
      this.Descuento = this.cFunciones.Redondeo(
        this.SubTotal * PorDescuento,
        "2"
      );

      this.Adicional = this.cFunciones.Redondeo(this.cFunciones.Redondeo(this.SubTotal - this.Descuento, "2") * PorcDescuentoAdicional, "2");


      this.SubTotalNeto = this.cFunciones.Redondeo(this.SubTotal - (this.Descuento + this.Adicional), "2");
      this.Impuesto = this.cFunciones.Redondeo(
        this.SubTotalNeto * PorcImpuesto,
        "2"
      );

      ImpuestoExo = 0;
      if (this.TipoExoneracion == "Exonerado" || this.bol_Exportacion) {
        ImpuestoExo = this.Impuesto;
        this.Impuesto = 0;
      }


      this.TotalDolar = this.cFunciones.Redondeo(this.SubTotalNeto + this.Impuesto, "2");
      this.TotalCordoba = this.cFunciones.Redondeo(
        this.TotalDolar * this.TC,
        "2"
      );
    }






    this.Detalle.IdVentaDetalle = "00000000-0000-0000-0000-000000000000";
    this.Detalle.IdVenta = "00000000-0000-0000-0000-000000000000";
    this.Detalle.Index = -1;
    this.Detalle.Codigo = this.CodProducto;
    this.Detalle.Producto = Producto[0].Producto;
    this.Detalle.Precio = (this.cFunciones.MonedaLocal == this.MonedaCliente ? PrecioCordoba : PrecioDolar);
    this.Detalle.PrecioCordoba = PrecioCordoba;
    this.Detalle.PrecioDolar = PrecioDolar;
    this.Detalle.PorcDescuento = PorDescuento;
    this.Detalle.PorcDescuentoAdicional = PorcDescuentoAdicional;
    this.Detalle.PorcImpuesto = PorcImpuesto;
    this.Detalle.Cantidad = Cantidad;
    this.Detalle.SubTotal = this.SubTotal;
    this.Detalle.Descuento = this.Descuento;
    this.Detalle.DescuentoAdicional = this.Adicional;
    this.Detalle.SubTotalNeto = this.SubTotalNeto;
    this.Detalle.Impuesto = this.Impuesto;
    this.Detalle.ImpuestoExo = ImpuestoExo;
    this.Detalle.Total = 0;
    this.Detalle.TotalCordoba = this.TotalCordoba;
    this.Detalle.TotalDolar = this.TotalDolar;
    this.Detalle.EsBonif = false;
    this.Detalle.EsBonifLibre = false;
    this.Detalle.EsExonerado = this.TipoExoneracion == "Exonerado" ? true : false;
    this.Detalle.EsExento = !Producto[0].ConImpuesto
    if(this.bol_Exportacion)  this.Detalle.EsExento = true;
    this.Detalle.PrecioLiberado = false;
    this.Detalle.PrecioLiberado = this.bol_EsPrecioLiberado;
    this.Detalle.PrecioLiberado = CambioPrecio;
    this.Detalle.IndexUnion = -1;

  }



  private ngOnInit() {

    ///CAMBIO DE FOCO
    this.val.addFocus("txtCodProducto", "txtPrecioCor", undefined);
    this.val.addFocus("txtPrecioCor", "txtCantidad", undefined);

    this.val.addFocus("txtPrecioDol", "txtCantidad", undefined);
    this.val.addFocus("txtCantidad", "txtProcDescuento", undefined);
    this.val.addFocus("txtProcDescuento", "btnAgregarProducto", "click");

    this.val.addNumberFocusIn();
    this.val.addFocusOut("txtCantidad", 0);
    this.val.addFocusOut("txtPrecioCor", 4);
    this.val.addFocusOut("txtProcDescuento", 2);


    //FILTRO PRODUCTO
    this.filteredProductos = this.val.Get("txtCodProducto").valueChanges.pipe(
      startWith(""),
      map((value: string) => {
        return this.lstProductos.filter((option) =>
          option.Key.toLowerCase().includes(
            (value || "").toLowerCase().trimStart()
          )
        );
      })
    );
  }
}
