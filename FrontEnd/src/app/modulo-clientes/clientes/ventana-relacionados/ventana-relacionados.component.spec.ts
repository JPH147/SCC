import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaRelacionadosComponent } from './ventana-relacionados.component';

describe('VentanaRelacionadosComponent', () => {
  let component: VentanaRelacionadosComponent;
  let fixture: ComponentFixture<VentanaRelacionadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaRelacionadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
