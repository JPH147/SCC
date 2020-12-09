import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HistorialMovimientosComponent } from './historial-movimientos.component';

describe('HistorialMovimientosComponent', () => {
  let component: HistorialMovimientosComponent;
  let fixture: ComponentFixture<HistorialMovimientosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialMovimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
