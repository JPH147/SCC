import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaRelacionadosComponent } from './ventana-relacionados.component';

describe('VentanaRelacionadosComponent', () => {
  let component: VentanaRelacionadosComponent;
  let fixture: ComponentFixture<VentanaRelacionadosComponent>;

  beforeEach(async(() => {
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
