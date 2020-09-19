import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaAdjuntoComponent } from './ventana-adjunto.component';

describe('VentanaAdjuntoComponent', () => {
  let component: VentanaAdjuntoComponent;
  let fixture: ComponentFixture<VentanaAdjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaAdjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaAdjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
