import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEditarTelefonoComponent } from './ventana-editar-telefono.component';

describe('VentanaEditarTelefonoComponent', () => {
  let component: VentanaEditarTelefonoComponent;
  let fixture: ComponentFixture<VentanaEditarTelefonoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarTelefonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarTelefonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
