import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { DynamicFormDirective } from '../../directive/dynamic-form.directive';
import { FacturaComponent } from 'src/app/FAC/componente/factura/factura.component';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @ViewChild(DynamicFormDirective, { static: true }) DynamicFrom!: DynamicFormDirective;
  

  
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

    


    var myOffcanvas : any = document.getElementById('offcanvas')


    var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)
    bsOffcanvas.show()


    $('.offcanvas-collapse').toggleClass('open');
    
myOffcanvas.addEventListener('show.bs.offcanvas', function () {
  alert('sadsa')
})

    //(<HTMLElement>document.getElementById('offcanvas')).classList.toggle('show');
  }


  
  public v_Abrir_Form(id : String) : void{
    
    
    if(id == "aNuevaFactura"){
      this.DynamicFrom.viewContainerRef.clear();
      this.DynamicFrom.viewContainerRef.createComponent(FacturaComponent);
    }
  }
  

}



