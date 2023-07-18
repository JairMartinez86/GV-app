import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactDeliveryComponent } from './fact-delivery.component';

describe('FactDeliveryComponent', () => {
  let component: FactDeliveryComponent;
  let fixture: ComponentFixture<FactDeliveryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactDeliveryComponent]
    });
    fixture = TestBed.createComponent(FactDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
