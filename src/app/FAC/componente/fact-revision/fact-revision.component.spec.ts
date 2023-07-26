import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactRevisionComponent } from './fact-revision.component';

describe('FactRevisionComponent', () => {
  let component: FactRevisionComponent;
  let fixture: ComponentFixture<FactRevisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FactRevisionComponent]
    });
    fixture = TestBed.createComponent(FactRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
