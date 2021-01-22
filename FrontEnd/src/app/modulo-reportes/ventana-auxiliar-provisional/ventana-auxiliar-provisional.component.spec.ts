import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaAuxiliarProvisionalComponent } from './ventana-auxiliar-provisional.component';

describe('VentanaAuxiliarProvisionalComponent', () => {
  let component: VentanaAuxiliarProvisionalComponent;
  let fixture: ComponentFixture<VentanaAuxiliarProvisionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaAuxiliarProvisionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaAuxiliarProvisionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
