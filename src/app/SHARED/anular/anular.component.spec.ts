import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnularComponent } from './anular.component';

describe('AnularComponent', () => {
  let component: AnularComponent;
  let fixture: ComponentFixture<AnularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnularComponent]
    });
    fixture = TestBed.createComponent(AnularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
