import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarCuotasComponent } from './consultar-cuotas.component';

describe('ConsultarCuotasComponent', () => {
  let component: ConsultarCuotasComponent;
  let fixture: ComponentFixture<ConsultarCuotasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarCuotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
