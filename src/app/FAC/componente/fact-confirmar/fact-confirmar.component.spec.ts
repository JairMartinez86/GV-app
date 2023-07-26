import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactConfirmarComponent } from './fact-confirmar.component';

describe('FactConfirmarComponent', () => {
  let component: FactConfirmarComponent;
  let fixture: ComponentFixture<FactConfirmarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactConfirmarComponent]
    });
    fixture = TestBed.createComponent(FactConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
