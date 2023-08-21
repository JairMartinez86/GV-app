import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { getFactura } from 'src/app/FAC/GET/get-factura';
import { AnularComponent } from 'src/app/SHARED/anular/anular.component';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';
import { WaitComponent } from 'src/app/SHARED/componente/wait/wait.component';
import { iDatos } from 'src/app/SHARED/interface/i-Datos';

@Component({
  selector: 'app-registro-factura',
  templateUrl: './registro-factura.component.html',
  styleUrls: ['./registro-factura.component.scss']
})
export class RegistroFacturaComponent {

  public val = new Validacion();
  public TipoDocumento: string;
  
  private lstDocumentos : any[];
  public lstFilter: any[] = [];
  public Pag : number = 1;
  public PagMax : number = 1;
  private NumRegMax : number = 100;

  constructor(
    private dialog: MatDialog,
    private Conexion: getFactura,
    public cFunciones: Funciones,
  ) {

    this.val.add("txtFecha1", "1", "LEN>", "0", "Fecha Inicio", "Ingrese una fecha valida.");
    this.val.add("txtFecha2", "1", "LEN>", "0", "Fecha Fdinal", "Ingrese una fecha valida.");
    this.val.add("txtBuscar", "1", "LEN>=", "0", "Buscar", "");

    this.val.Get("txtFecha1").setValue(this.cFunciones.ShortFechaServidor());
    this.val.Get("txtFecha2").setValue(this.cFunciones.ShortFechaServidor());

    
  }

  public CargarDocumentos(): void {

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );

    this.Conexion.Get(this.val.Get("txtFecha1").value, this.val.Get("txtFecha2").value, this.TipoDocumento).subscribe(
      (s) => {
        dialogRef.close();
        let _json = JSON.parse(s);
     
        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos[] = _json["d"];

          this.lstDocumentos = Datos[0].d;
         
          let i : number = 1;

          this.lstDocumentos.forEach(f =>{
            f.Index = i;
            i++;
          });

          this.lstFilter = this.lstDocumentos.map((obj : any) => ({...obj}));
          this.v_Paginar();
    
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


  public v_Anular(det : any) : void{

    let dialogRef: MatDialogRef<AnularComponent> = this.dialog.open(
      AnularComponent,
      {
        panelClass: window.innerWidth < 992 ? "escasan-dialog-full" : "escasan-dialog",
        disableClose: true
      }
    );
    
    dialogRef.afterOpened().subscribe(s =>{
      dialogRef.componentInstance.val.Get("txtNoDoc").setValue(det.TipoDocumento == "Factura" ? det.NoFactura : det.NoPedido);
      dialogRef.componentInstance.val.Get("txtSerie").setValue(det.Serie);
      dialogRef.componentInstance.val.Get("txtBodega").setValue(det.CodBodega);
      dialogRef.componentInstance.val.Get("txtFecha").setValue(this.cFunciones.DateFormat(det.Fecha, "yyyy-MM-dd"));
      dialogRef.componentInstance.IdDoc = det.IdVenta;
      dialogRef.componentInstance.Tipo = det.TipoDocumento;
    });


    dialogRef.afterClosed().subscribe(s =>{
      this.CargarDocumentos();
    });


  }


  public v_Filtrar(event : any){

    this.lstFilter.splice(0, this.lstFilter.length);
    let value : string = event.target.value.toLowerCase();
 

    let index : number = 1;
    this.lstDocumentos.filter(f => f.Filtro.toLowerCase().includes(value)).forEach(f =>{
      let ff = Object.assign({}, f);
      ff.Index = index;
      this.lstFilter.push(ff);
      index++;
    });

    let Registros = this.lstFilter.map((obj : any) => ({...obj}));
    this.lstFilter.splice(0, this.lstFilter.length);

    this.PagMax = Math.trunc(Registros.length / this.NumRegMax);
    if((Registros.length % this.NumRegMax) != 0) this.PagMax++;

    let x : number = 1;
    let IndexMin : number =  (this.Pag * this.NumRegMax) - (this.NumRegMax - 1);
    let IndexMax : number =  (this.Pag * this.NumRegMax);


    Registros.filter(f => f.Index >= IndexMin && f.Index <= IndexMax).forEach(f =>{
      this.lstFilter.push(f);

      if(x == this.NumRegMax) return;
      x++;
    });


  }

  
  public v_Paginar(){

    this.PagMax = Math.trunc(this.lstFilter.length / this.NumRegMax);
    if((this.lstFilter.length % this.NumRegMax) != 0) this.PagMax++;
    

    this.lstFilter.splice(0, this.lstFilter.length);

    let x : number = 1;
    let IndexMin : number =  (this.Pag * this.NumRegMax) - (this.NumRegMax - 1);
    let IndexMax : number =  (this.Pag * this.NumRegMax);

    this.lstDocumentos.filter(f => f.Index >= IndexMin && f.Index <= IndexMax).forEach(f =>{
      
      let ff = Object.assign({}, f);
      this.lstFilter.push(ff);

      if(x == this.NumRegMax) return;
      x++;
    });

  }

  public v_Pag(p : string) :void{

    let IndexMax : number =  0;


    if(p =="A")
    {
      IndexMax =  ((this.Pag - 1) * this.NumRegMax);
      if(this.lstFilter.length < IndexMax) return;

      if(this.Pag > 1)this.Pag -=1;
      this.v_Paginar();
      return;
    }

    if(p =="S")
    {
      IndexMax = ((this.Pag + 1) * this.NumRegMax);
      if(this.lstFilter.length < IndexMax) return;

      if(this.Pag < 5)this.Pag +=1;
      this.v_Paginar();
      return;
    }
    this.Pag = Number(p);
    this.v_Paginar();
  }

  private ngOnInit() {


    ///CAMBIO DE FOCO
    this.val.addFocus("txtFecha1", "txtFecha2", undefined);
    this.val.addFocus("txtFecha2", "btnBuscarFactura", "click");

    this.CargarDocumentos();
  }



}
