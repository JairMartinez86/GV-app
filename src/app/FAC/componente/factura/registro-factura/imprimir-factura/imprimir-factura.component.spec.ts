import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirFacturaComponent } from './imprimir-factura.component';

describe('ImprimirFacturaComponent', () => {
  let component: ImprimirFacturaComponent;
  let fixture: ComponentFixture<ImprimirFacturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImprimirFacturaComponent]
    });
    fixture = TestBed.createComponent(ImprimirFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
