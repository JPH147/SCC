import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaDetalleTalonarioComponent } from './ventana-detalle-talonario.component';

describe('VentanaDetalleTalonarioComponent', () => {
  let component: VentanaDetalleTalonarioComponent;
  let fixture: ComponentFixture<VentanaDetalleTalonarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaDetalleTalonarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaDetalleTalonarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
