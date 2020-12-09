import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RefinanciamientoComponent } from './refinanciamiento.component';

describe('RefinanciamientoComponent', () => {
  let component: RefinanciamientoComponent;
  let fixture: ComponentFixture<RefinanciamientoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RefinanciamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefinanciamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
