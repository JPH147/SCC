import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefinanciamientoComponent } from './refinanciamiento.component';

describe('RefinanciamientoComponent', () => {
  let component: RefinanciamientoComponent;
  let fixture: ComponentFixture<RefinanciamientoComponent>;

  beforeEach(async(() => {
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
