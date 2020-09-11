import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaUsuariosComponent } from './ventana-usuarios.component';

describe('VentanaUsuariosComponent', () => {
  let component: VentanaUsuariosComponent;
  let fixture: ComponentFixture<VentanaUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
