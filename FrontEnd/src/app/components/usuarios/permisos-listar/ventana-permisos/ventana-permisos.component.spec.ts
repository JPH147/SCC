import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaPermisosComponent } from './ventana-permisos.component';

describe('VentanaPermisosComponent', () => {
  let component: VentanaPermisosComponent;
  let fixture: ComponentFixture<VentanaPermisosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaPermisosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
