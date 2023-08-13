import { Component, HostListener, Input, Inject, Renderer2, ViewChild } from '@angular/core';
import { DynamicFormDirective } from '../../directive/dynamic-form.directive';
import { FacturaComponent } from 'src/app/FAC/componente/factura/factura.component';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { RegistroFacturaComponent } from 'src/app/FAC/componente/factura/registro-factura/registro-factura.component';
import { LoginService } from '../../service/login.service';
import { getServidor } from '../../GET/get-servidor';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { iDatos } from '../../interface/i-Datos';
import { Funciones } from '../../class/cls_Funciones';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WaitComponent } from '../wait/wait.component';

const SCRIPT_PATH = 'ttps://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.4/css/bootstrap5-toggle.min.css';
declare let gapi: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @ViewChild(DynamicFormDirective, { static: true }) DynamicFrom!: DynamicFormDirective;
  
  

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private _SrvLogin: LoginService,
    private Conexion: getServidor,
    private cFunciones : Funciones,
    private dialog: MatDialog,
  ) {

   
}
  

  @Input() public href: string | undefined;
  @HostListener('click', ['$event']) public onClick(event: Event): void {

    var element = <HTMLElement>event.target;
  
    if (
      (!this.href ||
      this.href == '#' ||
      (this.href && this.href.length === 0) || element.tagName.toString().toLocaleLowerCase()  == "i")
    ) {
     

      
      if (element.tagName.toString().toLocaleLowerCase() == "a" && element.getAttribute("href") == "#" || element.tagName.toString().toLocaleLowerCase()  == "i") {
       
        if(element.tagName.toString().toLocaleLowerCase()  == "i"){
          element = <HTMLElement>event.target;
          element = <HTMLElement>element.parentElement;
          
        }
        this.v_Abrir_Form(element.id);
      }

      if (element.tagName.toString().toLocaleLowerCase() == "span") {
        return;
      }

      if(element.tagName.toString().toLocaleLowerCase() == "a")event.preventDefault();
     
    }
  }



  ngOnInit() {

    //INSERTAR SCRIPT
    /*
    const script = this.renderer.createElement("script");
    this.renderer.setProperty(
      script,
      "text",
      "alert('asdsa')"
    );
    this.renderer.appendChild(this.document.body, script);
*/
    //FIN

    let dialogRef: MatDialogRef<WaitComponent> = this.dialog.open(
      WaitComponent,
      {
        id: "wait",
        panelClass: "escasan-dialog-full-blur",
        data: "",
      }
    );
    

    $("#btnMenu").trigger("click"); // MOSTRAR MENU DESDE EL INICIO
   
    
    this.Conexion.FechaServidor().subscribe(
      (s) => {

        dialogRef.close();

        let _json = JSON.parse(s);

        if (_json["esError"] == 1) {
          this.dialog.open(DialogErrorComponent, {
            data: _json["msj"].Mensaje,
          });
        } else {
          let Datos: iDatos[] = _json["d"];

          this.cFunciones.FechaServidor(Datos[0].d);

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


  
  public v_Abrir_Form(id : string) : void{
    
    if(id == "aNuevaFactura"){
      $("#btnMenu").trigger("click");

     /* let link: HTMLLinkElement = this.document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.6/css/bootstrap5-toggle.min.css');
      this.document.head.appendChild(link);
  
      let  script = this.document.createElement('script');
      script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.6/js/bootstrap5-toggle.jquery.min.js');
      this.document.head.appendChild(script);
      */
      this.DynamicFrom.viewContainerRef.clear();
      this.DynamicFrom.viewContainerRef.createComponent(FacturaComponent);

     
    

    }

    if(id == "aRegistroFactura"){
      this.DynamicFrom.viewContainerRef.clear();
      this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);

    }

    if(id == "aSalir"){
     this._SrvLogin.CerrarSession();
  
    }
  }
  

}



