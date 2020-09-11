import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEditarCuentaComponent } from './ventana-editar-cuenta.component';

describe('VentanaEditarCuentaComponent', () => {
  let component: VentanaEditarCuentaComponent;
  let fixture: ComponentFixture<VentanaEditarCuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarCuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
