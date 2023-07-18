import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactBonificacionLibreComponent } from './fact-bonificacion-libre.component';

describe('FactBonificacionLibreComponent', () => {
  let component: FactBonificacionLibreComponent;
  let fixture: ComponentFixture<FactBonificacionLibreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactBonificacionLibreComponent]
    });
    fixture = TestBed.createComponent(FactBonificacionLibreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
