import { Component } from '@angular/core';
import { TablaDatosComponent } from '../../tabla-datos/tabla-datos.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { FactBonificacionLibreComponent } from '../fact-bonificacion-libre/fact-bonificacion-libre.component';

@Component({
  selector: 'app-fact-ficha-producto',
  templateUrl: './fact-ficha-producto.component.html',
  styleUrls: ['./fact-ficha-producto.component.scss']
})
export class FactFichaProductoComponent {


  myControl = new FormControl('');
  options: string[] = ['Uno', 'Dos', 'Tres'];
  filteredOptions: Observable<string[]> | undefined;

  public constructor(public dialog: MatDialog){}

    //████████████████████████████████████████████FICHA PRODUCTO████████████████████████████████████████████████████████████████████████


    public v_Datos_Producto(p: String): void {
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
}
