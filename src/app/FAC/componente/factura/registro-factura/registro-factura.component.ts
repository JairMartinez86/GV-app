import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { getFactura } from 'src/app/FAC/GET/get-factura';
import { iFactPed } from 'src/app/FAC/interface/i-Factura-Pedido';
import { AnularComponent } from 'src/app/SHARED/anular/anular.component';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';
import { FacturaComponent } from '../factura.component';
import * as printJS from 'print-js';

let DatosImpresion : iDatos[];

@Component({
  selector: 'app-registro-factura',
  templateUrl: './registro-factura.component.html',
  styleUrls: ['./registro-factura.component.scss']
})
export class RegistroFacturaComponent {

  public val = new Validacion();
  displayedColumns: string[] = ["col1"];
  @ViewChild(MatPaginator) paginator: MatPaginator;


  public TipoDocumento: string;
  public EsCola: boolean = false;
  


  public lstDocumentos: MatTableDataSource<iFactPed[]>;

  constructor(
    private GET: getFactura,
    public cFunciones: Funciones,
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");
    this.val.add("txtBuscar", "1", "LEN>=", "0", "Buscar", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());


  }

  public CargarDocumentos(): void {

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.Get(this.val.Get("txtFecha1").value, this.val.Get("txtFecha2").value, this.TipoDocumento, this.EsCola).subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos[] = _json["d"];


          this.lstDocumentos = new MatTableDataSource(Datos[0].d);
          this.lstDocumentos.paginator = this.paginator;

          //this.lstFilter = this.lstDocumentos.map((obj : any) => ({...obj}));


        }
      },
      (err) => {
        document.getElementById("btnRefrescar")?.removeAttribute("disabled");
        dialogRef.close();

        if (this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) {
          this.cFunciones.DIALOG.open(DialogErrorComponent, {
            id: "error-servidor",
            data: "<b class='error'>" + err.message + "</b>",
          });
        }
      }
    );
  }


  public v_Anular(det: any): void {

    let dialogRef: MatDialogRef<AnularComponent> = this.cFunciones.DIALOG.open(
      AnularComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );

    dialogRef.afterOpened().subscribe(s => {
      dialogRef.componentInstance.val.Get("txtNoDoc").setValue(det.TipoDocumento == "Factura" ? det.NoFactura : det.NoPedido);
      dialogRef.componentInstance.val.Get("txtSerie").setValue(det.Serie);
      dialogRef.componentInstance.val.Get("txtBodega").setValue(det.CodBodega);
      dialogRef.componentInstance.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(det.Fecha, "yyyy-MM-dd"));
      dialogRef.componentInstance.IdDoc = det.IdVenta;
      dialogRef.componentInstance.Tipo = det.TipoDocumento;
    });


    dialogRef.afterClosed().subscribe(s => {
      this.CargarDocumentos();
    });


  }

  public v_Filtrar(event: any) {
    this.lstDocumentos.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }


  public v_Editar(det: iFactPed) {


    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.GetDetalle(det.IdVenta).subscribe(
      {
        next: (s) => {


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

            det.VentaDetalle = Datos[0].d;


            let dialogRef: MatDialogRef<FacturaComponent> =
              this.cFunciones.DIALOG.open(FacturaComponent, {
                id: "dialog-factura-editar",
                panelClass: "escasan-dialog-full",
                disableClose: true
              });

            dialogRef.afterOpened().subscribe(s => {
              dialogRef.componentInstance.v_Editar(det);

            });

            dialogRef.afterClosed().subscribe(s => {
              this.CargarDocumentos();

            });

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
          dialogRef.close();
        }
      }
    );



  }

  public v_Imprimir(det: iFactPed): void {

    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.Imprimir(det.IdVenta).subscribe(
      {
        next: (s) => {


          let _json = JSON.parse(s);

          if (_json["esError"] == 1) {
            if (this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined) {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                id: "error-servidor-msj",
                data: _json["msj"].Mensaje,
              });
            }
          } else {
            DatosImpresion = _json["d"];


            this.V_Mostrar_Factura_Impresa();
            //this.print();

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
          dialogRef.close();
        }
      }
    );

  }
  

  print() {

    let byteArray = new Uint8Array(atob(DatosImpresion[0].d).split('').map(char => char.charCodeAt(0)));


    var file = new Blob([byteArray], { type: 'application/pdf' });
   
    let url = URL.createObjectURL(file);


    const iframe = document.createElement('iframe');
   iframe.style.display = 'none';
   iframe.src = url;
   document.body.appendChild(iframe);    
   iframe.onload = () => {
       setTimeout(() => {
          iframe.focus();
          iframe.contentWindow?.print();

          setTimeout(() => {


            
    let byteArray2 = new Uint8Array(atob(DatosImpresion[1].d).split('').map(char => char.charCodeAt(0)));
    let file2 = new Blob([byteArray2], { type: 'application/pdf' });
    let url2 = URL.createObjectURL(file2);

    const iframe2 = document.createElement('iframe');
    iframe2.style.display = 'none';
    iframe2.src = url2;
    document.body.appendChild(iframe2);    
    iframe2.onload = () => {
        setTimeout(() => {
          iframe2.focus();
          iframe2.contentWindow?.print();
        });
     };

         }, 1000);

       });
    };





  }

  private V_Mostrar_Factura_Impresa(): void {


    let byteArray = new Uint8Array(atob(DatosImpresion[0].d).split('').map(char => char.charCodeAt(0)));
    let byteArray2 = new Uint8Array(atob(DatosImpresion[1].d).split('').map(char => char.charCodeAt(0)));


    var file = new Blob([byteArray], { type: 'application/pdf' });
    var file2 = new Blob([byteArray2], { type: 'application/pdf' });
   
    let url = URL.createObjectURL(file);
    let url2 = URL.createObjectURL(file2);

    if(window.innerWidth > 992)
    {
 
      printJS({ printable: [url, url2], type: 'pdf',  showModal: false });
    }
    else
    {
        var a = document.createElement("a");
        a.id = "print"
         a.href = url;
        a.download = DatosImpresion[0].Nombre  + ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove()
    }
   
   

  }

  public V_Mostrar_Manifiesto() {
return
    let byteArray = new Uint8Array(atob(DatosImpresion[1].d).split('').map(char => char.charCodeAt(0)));
    let file = new Blob([byteArray], { type: 'application/pdf' });
    let url = URL.createObjectURL(file);

    if(window.innerWidth > 992)
    {
      printJS({ printable: url, type: 'pdf', showModal: false,  onPrintDialogClose: this.CargarDocumentos });
    }
    else
    {
        var a = document.createElement("a");
        a.id = "print"
         a.href = url;
        a.download = DatosImpresion[1].Nombre + ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove()
    }

  


    

  }



  private ngAfterViewInit() {


    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "btnBuscarFactura", "click");

    this.CargarDocumentos();
  }



}






