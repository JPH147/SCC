import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEditarCuotasComponent } from './ventana-editar-cuotas.component';

describe('VentanaEditarCuotasComponent', () => {
  let component: VentanaEditarCuotasComponent;
  let fixture: ComponentFixture<VentanaEditarCuotasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarCuotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
