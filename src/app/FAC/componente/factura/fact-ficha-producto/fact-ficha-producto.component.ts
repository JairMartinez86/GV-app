import { Component } from '@angular/core';
import { TablaDatosComponent } from '../../tabla-datos/tabla-datos.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { FactBonificacionLibreComponent } from '../fact-bonificacion-libre/fact-bonificacion-libre.component';
import { iProducto } from 'src/app/FAC/interface/i-Producto';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { getFactura } from 'src/app/FAC/GET/get-factura';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { iPrecio } from 'src/app/FAC/interface/i-Precio';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';

@Component({
  selector: 'app-fact-ficha-producto',
  templateUrl: './fact-ficha-producto.component.html',
  styleUrls: ['./fact-ficha-producto.component.scss']
})
export class FactFichaProductoComponent {

  public val = new Validacion();

  public CodCliente : string = "";

  public CodProducto: string = "";
  lstProductos: iProducto[] = [];
  filteredProductos: Observable<iProducto[]> | undefined;


  private lstPrecios: iPrecio[] = [];

  public constructor(private dialog: MatDialog, private Conexion : getFactura, private cFunciones : Funciones){

    this.val.add("txtCodProducto", "1", "LEN>", "0", "CodProducto", "Seleccione un producto.");
    this.val.add("txtProducto", "1", "LEN>=", "0", "Producto", "");
    this.val.add("txtPrecioCor", "1", "NUM>", "0", "Precio Cordoba", "Ingrese  precio cordoba.");
    this.val.add("txtPrecioDol", "1", "DEC>", "0", "Precio Dolar", "Ingrese  precio dolar.");
    this.val.add("txtCantidad", "1", "NUM>", "0", "Cantidad", "Ingrese una cantidad valida.");
    this.val.add("txtProcDescuento", "1", "DEC>=", "0", "% Descuento", "Ingrese un descuento valido.");

    this._Evento("Limpiar", "");
  }

  public _Evento(e: string, CodCliente : string): void {
    switch (e) {
      case "Iniciar":
        this.CodCliente = CodCliente;
        this.v_Cargar_Productos();

        break;

      case "Limpiar":

      this.CodCliente = "";
      this.val.Get("txtCodProducto").setValue("");
      this.val.Get("txtProducto").setValue("");
      this.val.Get("txtPrecioCor").setValue("0.00");
      this.val.Get("txtPrecioDol").setValue("0.00");
      this.val.Get("txtCantidad").setValue("1");
      this.val.Get("txtProcDescuento").setValue("0.00");
       
        break;
    }
  }


    //████████████████████████████████████████████FICHA PRODUCTO████████████████████████████████████████████████████████████████████████

    public v_Cargar_Productos() : void{

      document
      .getElementById("btnRefrescarProductos")
      ?.setAttribute("disabled", "disabled");

        let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
          WaitComponent,
          {
            id: "wait",
            panelClass: "escasan-dialog-full-blur",
            data: "",
          }
        );
    
        this.Conexion.Cargar_Productos(this.CodCliente).subscribe(
          (s) => {

            document.getElementById("btnRefrescarProductos")?.removeAttribute("disabled");
            dialogRef.close();
            let _json = JSON.parse(s);
    
            if (_json["esError"] == 1) {
              this.dialog.open(DialogErrorComponent, {
                data: _json["msj"].Mensaje,
              });
            } else {
              let Datos: iDatos[] = _json["d"];
    
              this.lstProductos = Datos[0].d;
              this.lstPrecios = Datos[1].d;

            }
          },
          (err) => {

            document.getElementById("btnRefrescarProductos")?.removeAttribute("disabled");
            dialogRef.close();
    
            this.dialog.open(DialogErrorComponent, {
              data: "<b class='error'>" + err.message + "</b>",
            });
          }
        );
      }

    public v_Select_Producto(event: any): void {
      let Producto: iProducto[] = this.lstProductos.filter(
        (f) => f.Codigo == event.option.value
      );
  
      this.CodProducto = "";
      this.val.Get("txtProducto").setValue("");
      this.val.Get("txtPrecioCor").setValue("0.00");
      this.val.Get("txtPrecioDol").setValue("0.00");
      this.val.Get("txtCantidad").setValue("1");
      this.val.Get("txtProcDescuento").setValue("0.00");
  
      if (Producto.length > 0) {
        this.CodProducto = Producto[0].Codigo;
        this.val.Get("txtProducto").setValue(Producto[0].Producto);
        this.val.Get("txtPrecioCor").setValue("0.00");
        this.val.Get("txtPrecioDol").setValue("0.00");

  
        this.val.Get("txtCodProducto").disable();
        this.val.Get("txtProducto").disable();
      }
    }
  


    public v_Datos_Producto(p: string): void {
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

    public v_Bonificacion_Libre() : void{
      let dialogRef: MatDialogRef<FactBonificacionLibreComponent> = this.dialog.open(
        FactBonificacionLibreComponent,
        {
          panelClass: (window.innerWidth < 992 ? "escasan-dialog-full" : ""),
          data: "",
        }
      );
  
    }

    public v_Agregar_Producto(): void{
      
    }


    private ngOnInit() {
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
