import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactFichaProductoComponent } from './fact-ficha-producto.component';

describe('FactFichaProductoComponent', () => {
  let component: FactFichaProductoComponent;
  let fixture: ComponentFixture<FactFichaProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactFichaProductoComponent]
    });
    fixture = TestBed.createComponent(FactFichaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
