import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaGenerarInteresComponent } from './ventana-generar-interes.component';

describe('VentanaGenerarInteresComponent', () => {
  let component: VentanaGenerarInteresComponent;
  let fixture: ComponentFixture<VentanaGenerarInteresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaGenerarInteresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaGenerarInteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
