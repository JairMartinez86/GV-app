import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-imprimir-factura',
  templateUrl: './imprimir-factura.component.html',
  styleUrls: ['./imprimir-factura.component.scss']
})
export class ImprimirFacturaComponent {


  private url : any;
  private url2 : any;
 
  constructor(
    private dialogRef: MatDialogRef<ImprimirFacturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
  ) {
    this.url = data[0];
    this.url2 = data[1];

    
   

  }

  public v_Factura() : void{

    let iframe = document.createElement('iframe');
    iframe.id = "fFactura";
    iframe.style.display = 'none';

    iframe.src = this.url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.focus();
        iframe.contentWindow?.print();

      });
    };

  };

  public v_Manifiesto() : void{
    let iframe = document.createElement('iframe');
    iframe.id = "fManifiesto";
    iframe.style.display = 'none';

    iframe.src = this.url2;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.focus();
        iframe.contentWindow?.print();

      });
    };
  };


  public v_Cerrar() : void{
   
    document.getElementById("fFactura")?.remove();
    document.getElementById("fManifiesto")?.remove();
    this.dialogRef.close();
  };

}
