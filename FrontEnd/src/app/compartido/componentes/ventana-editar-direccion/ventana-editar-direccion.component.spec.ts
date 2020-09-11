import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEditarDireccionComponent } from './ventana-editar-direccion.component';

describe('VentanaEditarDireccionComponent', () => {
  let component: VentanaEditarDireccionComponent;
  let fixture: ComponentFixture<VentanaEditarDireccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarDireccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarDireccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
