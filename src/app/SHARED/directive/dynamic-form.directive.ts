import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[DynamicFrom]'
})
export class DynamicFormDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }


}
