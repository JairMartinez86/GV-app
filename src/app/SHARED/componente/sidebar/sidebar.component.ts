import { Component, HostListener, Input, Inject, Renderer2, ViewChild, ComponentRef } from '@angular/core';
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
import { Subscription, interval } from 'rxjs';

const SCRIPT_PATH = 'ttps://cdn.jsdelivr.net/npm/bootstrap5-toggle@5.0.4/css/bootstrap5-toggle.min.css';
declare let gapi: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @ViewChild(DynamicFormDirective, { static: true }) DynamicFrom!: DynamicFormDirective;
  public ErrorServidor: boolean = false;
  subscription: Subscription = {} as Subscription;


  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: HTMLDocument,
    private _SrvLogin: LoginService,
    private Conexion: getServidor,
    private cFunciones: Funciones,
  ) {
  }


  @Input() public href: string | undefined;
  @HostListener('click', ['$event']) public onClick(event: Event): void {

    var element = <HTMLElement>event.target;

    if (
      (!this.href ||
        this.href == '#' ||
        (this.href && this.href.length === 0) || element.tagName.toString().toLocaleLowerCase() == "i")
    ) {


      if (element.tagName.toString().toLocaleLowerCase() == "a" && element.getAttribute("href") == "#" || element.tagName.toString().toLocaleLowerCase() == "i") {

        if (element.tagName.toString().toLocaleLowerCase() == "i") {
          element = <HTMLElement>event.target;
          element = <HTMLElement>element.parentElement;

        }
        if(element?.id == undefined) return
        this.v_Abrir_Form(element.id);
      }




      if (element.tagName.toString().toLocaleLowerCase() == "span") event.preventDefault();

      if (element.tagName.toString().toLocaleLowerCase() == "a") event.preventDefault();

    }
  }




  public v_Abrir_Form(id: string): void {

    if (id == "") return;
    if (id == "btnMenu") return;


   
    if(this.ErrorServidor && id != "aSalir"){
      this.cFunciones.DIALOG.closeAll();
      this.cFunciones.DIALOG.open(DialogErrorComponent, {
        data: "<b class='error'>" + "Obteniendo Información del servidor por favor espere." + "</b>",
      });
      return;
    }

    if (id == "aNewFactura") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();

      let Factura: ComponentRef<FacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(FacturaComponent);
      Factura.instance.TipoFactura = "Factura";
    }

    if (id == "aNewPedido") {
      $("#btnMenu").trigger("click");
      this.DynamicFrom.viewContainerRef.clear();
      let Pedido: ComponentRef<FacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(FacturaComponent);
      Pedido.instance.TipoFactura = "Pedido";
    }

    if (id == "aRegistroFactura") {
      this.DynamicFrom.viewContainerRef.clear();
      let RegFactura: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegFactura.instance.TipoDocumento = "Factura";
    }

    if (id == "aRegistroPedido") {
      this.DynamicFrom.viewContainerRef.clear();
      let RegPedido: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegPedido.instance.TipoDocumento = "Pedido";
    }


    if (id == "aRegistroCola") {
      this.DynamicFrom.viewContainerRef.clear();
      let RegPedido: ComponentRef<RegistroFacturaComponent> = this.DynamicFrom.viewContainerRef.createComponent(RegistroFacturaComponent);
      RegPedido.instance.TipoDocumento = "Factura";
      RegPedido.instance.EsCola = true;
    }



    if (id == "aSalir") {
      this.ErrorServidor = true;
      this._SrvLogin.CerrarSession();

    }
  }


  
  private ActualizarDatosServidor() : void{
    this.ErrorServidor = false;


    this.Conexion.FechaServidor(this.cFunciones.User).subscribe(
      {
        next : (data) => {
          
          let _json : any = JSON.parse(data);

        if (_json["esError"] == 1) {
          if(this.cFunciones.DIALOG.getDialogById("error-servidor-msj") == undefined){
            this.cFunciones.DIALOG.open(DialogErrorComponent, {
              id: "error-servidor-msj",
              data: _json["msj"].Mensaje,
            });
          }
        } else {
          let Datos: iDatos[] = _json["d"];

          this.cFunciones.FechaServidor(Datos[0].d);
          this.cFunciones.SetTiempoDesconexion(Number(Datos[1].d));
          this._SrvLogin.UpdFecha(String(Datos[0].d));
        }
		
		 if(this.cFunciones.DIALOG.getDialogById("error-servidor") != undefined) 
          {
            this.cFunciones.DIALOG.getDialogById("error-servidor")?.close();
          }


        },
        error: (err) => {

			  
		   this.ErrorServidor = true;
			
			  
			  /*if(this.cFunciones.DIALOG.getDialogById("error-servidor") == undefined) 
			  {
				this.cFunciones.DIALOG.open(DialogErrorComponent, {
				  id : "error-servidor",
				  data: "<b class='error'>" + err.message + "</b>",
				});
			  }*/
       
       
   

        },
        complete : ( ) => { 

        }
      }
    );
    
  }


  
  ngOnInit() {

    this.subscription = interval(10000).subscribe(val => this.ActualizarDatosServidor())
    
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



  }

  ngAfterContentInit() {
    $("#btnMenu").trigger("click"); // MOSTRAR MENU DESDE EL INICIO
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }


}



