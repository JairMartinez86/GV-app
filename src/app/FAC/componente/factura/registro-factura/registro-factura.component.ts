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
import { PDFDocument } from 'pdf-lib';
import { FactConfirmarComponent } from '../fact-confirmar/fact-confirmar.component';
import { DialogoConfirmarComponent } from 'src/app/SHARED/componente/dialogo-confirmar/dialogo-confirmar.component';
import { ImprimirFacturaComponent } from './imprimir-factura/imprimir-factura.component';

let DatosImpresion: iDatos[];

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

  @ViewChild("datepiker", { static: false })
  public datepiker: any;

  @ViewChild("datepiker2", { static: false })
  public datepiker2: any;


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

    document.getElementById("btnRefrescar")?.setAttribute("disabled", "disabled");

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
          document.getElementById("btnRefrescar")?.removeAttribute("disabled");

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


  public v_Editar(det: iFactPed, Visualizar : boolean) {



    let dialogRef: MatDialogRef<WaitComponent> = this.cFunciones.DIALOG.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.GET.GetDetalle(det.IdVenta, this.cFunciones.User, Visualizar).subscribe(
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


            if(Datos[1].d != "1" && Datos[1].d != "2")
            {
              this.cFunciones.DIALOG.open(DialogErrorComponent, {
                data: Datos[1].d ,
              });
              return;
            }

            

            det.VentaDetalle = Datos[0].d;


            let dialogRef: MatDialogRef<FacturaComponent> =
              this.cFunciones.DIALOG.open(FacturaComponent, {
                id: "dialog-factura-editar",
                panelClass: "escasan-dialog-full",
                disableClose: true
              });

            dialogRef.afterOpened().subscribe(s => {
              dialogRef.componentInstance.v_Editar(det, Datos[1].d);

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

    this.GET.Imprimir(det.IdVenta, this.cFunciones.User).subscribe(
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
           // DatosImpresion = _json["d"];

            this.CargarDocumentos();
            this.printPDFS2(_json["d"]);
            
    
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



  /* Convert the merged pdf array buffer to blob url for print or open in browser.*/
  downloadFile(data: any) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    //window.open(url);
    printJS({
      printable: url,
      type: 'pdf',
      onPrintDialogClose: this.V_Mostrar_Manifiesto
    })

  }


  

  async printPDFS2(datos: any) {



    let byteArray = new Uint8Array(atob(datos.d[0].d).split('').map(char => char.charCodeAt(0)));

    var file = new Blob([byteArray], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);

    let tabOrWindow : any = window.open(url, '_blank');
    tabOrWindow.focus();




    
    let byteArray2 = new Uint8Array(atob(datos.d[1].d).split('').map(char => char.charCodeAt(0)));

    var file2 = new Blob([byteArray2], { type: 'application/pdf' });

    let url2 = URL.createObjectURL(file2);

    let tabOrWindow2 : any = window.open(url2, '_blank');
    tabOrWindow2.focus();



  }

  


  async printPDFS() {

   
    
    let byteArray = new Uint8Array(atob(DatosImpresion[0].d).split('').map(char => char.charCodeAt(0)));
    let byteArray2 = new Uint8Array(atob(DatosImpresion[1].d).split('').map(char => char.charCodeAt(0)));


    var file = new Blob([byteArray], { type: 'application/pdf' });
    var file2 = new Blob([byteArray2], { type: 'application/pdf' });

    let url = URL.createObjectURL(file);
    let url2 = URL.createObjectURL(file2);

     /* Array of pdf urls */
     let pdfsToMerge = [url, url2];

   // if (window.innerWidth > 992)
   // {

      if (this.cFunciones.MyBrowser() == "Firefox")
      {
        let dialogRef: MatDialogRef<ImprimirFacturaComponent> = this.cFunciones.DIALOG.open(
          ImprimirFacturaComponent,
          {
            panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
            data : pdfsToMerge,
            disableClose: true
          }
        );
      }
      else
      {
        pdfsToMerge = [url]; //  let pdfsToMerge = [url, url2] imprimir multiples pdf en una sola ventana;
        const mergedPdf = await PDFDocument.create();
        for (const pdfCopyDoc of pdfsToMerge) {
          const pdfBytes = await fetch(pdfCopyDoc).then(res => res.arrayBuffer())
          //const pdfBytes = fs.readFileSync(pdfCopyDoc);
          const pdf = await PDFDocument.load(pdfBytes);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page : any) => {
            mergedPdf.addPage(page);
          });
        }
        const mergedPdfFile = await mergedPdf.save();
        this.downloadFile(mergedPdfFile);
   
      }

      
 //   }
 /*   else
    {
      var a = document.createElement("a");
      a.href = url;
      a.download = DatosImpresion[0].Nombre + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove()

      a = document.createElement("a");
      a.href = url2;
      a.download = DatosImpresion[1].Nombre + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove()

    }

*/
  }



  public V_Mostrar_Manifiesto() {
    let byteArray = new Uint8Array(atob(DatosImpresion[1].d).split('').map(char => char.charCodeAt(0)));
    let file = new Blob([byteArray], { type: 'application/pdf' });
    let url = URL.createObjectURL(file);

    printJS({ printable: url, type: 'pdf', showModal: false, onPrintDialogClose: this.CargarDocumentos });


  }



  private ngAfterViewInit() {

   
    
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker != undefined) this.datepiker.mode="dialog";
    if(window.innerWidth < this.cFunciones.TamanoPantalla("md")) if(this.datepiker2 != undefined) this.datepiker2.mode="dialog";

    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "btnBuscarFactura", "click");

    this.CargarDocumentos();
  }



}






