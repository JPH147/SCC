import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesDetalleComponent } from './comisiones-detalle.component';

describe('ComisionesDetalleComponent', () => {
  let component: ComisionesDetalleComponent;
  let fixture: ComponentFixture<ComisionesDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionesDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
