import { Component, HostListener, Input, Inject, Renderer2, ViewChild } from '@angular/core';
import { DynamicFormDirective } from '../../directive/dynamic-form.directive';
import { FacturaComponent } from 'src/app/FAC/componente/factura/factura.component';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @ViewChild(DynamicFormDirective, { static: true }) DynamicFrom!: DynamicFormDirective;
  
  

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: HTMLDocument
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

    $("#btnMenu").click(); // MOSTRAR MENU DESDE EL INICIO
   
  
  }


  
  public v_Abrir_Form(id : String) : void{
    
    if(id == "aNuevaFactura"){
      $("#btnMenu").click();
      this.DynamicFrom.viewContainerRef.clear();
      this.DynamicFrom.viewContainerRef.createComponent(FacturaComponent);
    }
  }
  

}



