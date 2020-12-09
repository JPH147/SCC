import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaUsuariosComponent } from './ventana-usuarios.component';

describe('VentanaUsuariosComponent', () => {
  let component: VentanaUsuariosComponent;
  let fixture: ComponentFixture<VentanaUsuariosComponent>;

  beforeEach(waitForAsync(() => {
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
