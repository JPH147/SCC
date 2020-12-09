import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentasSalidaComponent } from './ventas-salida.component';

describe('VentasSalidaComponent', () => {
  let component: VentasSalidaComponent;
  let fixture: ComponentFixture<VentasSalidaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
