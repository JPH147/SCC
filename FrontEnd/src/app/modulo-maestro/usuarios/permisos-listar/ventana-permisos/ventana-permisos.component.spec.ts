import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaPermisosComponent } from './ventana-permisos.component';

describe('VentanaPermisosComponent', () => {
  let component: VentanaPermisosComponent;
  let fixture: ComponentFixture<VentanaPermisosComponent>;

  beforeEach(waitForAsync(() => {
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
