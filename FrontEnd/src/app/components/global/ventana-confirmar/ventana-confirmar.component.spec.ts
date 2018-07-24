import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaConfirmarComponent } from './ventana-confirmar.component';

describe('VentanaConfirmarComponent', () => {
  let component: VentanaConfirmarComponent;
  let fixture: ComponentFixture<VentanaConfirmarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaConfirmarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaConfirmarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
