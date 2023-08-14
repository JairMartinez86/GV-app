import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { iBonifLibre } from 'src/app/FAC/interface/i-Bonif-Libre';
import { Funciones } from 'src/app/SHARED/class/cls_Funciones';
import { Validacion } from 'src/app/SHARED/class/validacion';
import { DialogErrorComponent } from 'src/app/SHARED/componente/dialog-error/dialog-error.component';


@Component({
  selector: 'app-fact-bonificacion-libre',
  templateUrl: './fact-bonificacion-libre.component.html',
  styleUrls: ['./fact-bonificacion-libre.component.scss']
})
export class FactBonificacionLibreComponent {

  public val = new Validacion();
  
  private lstProductos: iBonifLibre[] = [];
  public lstFilter: iBonifLibre[] = [];
  public i_Bonif : any;

  constructor(
    private dialog: MatDialog,
    public cFunciones: Funciones,
    public dialogRef: MatDialogRef<FactBonificacionLibreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){

    this.val.add("txtCantidadBonif", "1", "NUM>", "0", "Cantidad", "Ingrese una cantidad valida.");

    let i :number = 0;
    data.filter((f:any) => f.Bonificable).forEach((f:any) =>{

      var e : iBonifLibre = {Codigo: f.Codigo, Producto: f.Producto, Filtro : f.Key, Seleccionar : (i == 0 ? true : false)};
      this.lstProductos.push(e);

      if(i == 0) this.i_Bonif = e;
      i++;
    });

    this.lstFilter = this.lstProductos.map((obj : any) => ({...obj}));
    this.val.Get("txtCantidadBonif").setValue("1");
  }

  public v_minus_mas(s : string) : void{

    let valor : string = this.val.Get("txtCantidadBonif").value;

   if(valor == "" || valor == undefined) valor = "0";


   let num : number = Number(valor.replaceAll("," , ""))

  

    if(s == "+") num += 1;

    if(s == "-") num -= 1;

    this.val.Get("txtCantidadBonif").setValue(this.cFunciones.NumFormat(num, "0"));

  }


  public v_FocusOut(): void {
    this.val.Get("txtCantidadBonif").setValue(this.cFunciones.NumFormat(this.val.Get("txtCantidadBonif").value.replaceAll(",", ""), "0"));
  }

  public v_Seleccionar(det : iBonifLibre): void{

    this.i_Bonif = undefined;
    if(det.Seleccionar)  this.i_Bonif  = det;

    this.lstFilter.forEach(f =>{
      if(det.Codigo != f.Codigo)f.Seleccionar = false;
    });
  }

  public v_ForzarSeleccionar(Codigo : string): void{

    this.i_Bonif = undefined;
    this.lstFilter.forEach(f =>{
      f.Seleccionar = false;
      if(f.Codigo == Codigo){
        f.Seleccionar = true;
        this.i_Bonif = f;
        return;
      }

    });
  }

  public v_Aceptar() :void{

    this.val.EsValido();
    let Error : string = "";

    if(this.i_Bonif == null)Error = "<li class='error-etiqueta'>Producto<ul><li class='error-mensaje'>Seleccione al menos un producto a bonificar.</li></ul>";

    if(this.val.Errores != "" && Error == "")
    {
      this.dialog.open(DialogErrorComponent, {
        data: this.val.Errores + Error,
      });

      return;
    }
    
    this.dialogRef.close();
  }

  public v_Cancelar() :void{
    this.i_Bonif = undefined;
    this.dialogRef.close();
  }
  

  public v_Filtrar(event : any){

    this.lstFilter.splice(0, this.lstFilter.length);
    let value : string = event.target.value.toLowerCase();
 
 
    this.lstProductos.filter(f => f.Filtro.toLowerCase().includes(value)).forEach(f =>{
      this.lstFilter.push(f);
    });

  }

  private ngOnInit() {

    ///CAMBIO DE FOCO
    this.val.addFocus("txtCantidadBonif", "btnAgregarBonif", "click");

  }


}
