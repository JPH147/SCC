import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaLlamadasComponent } from './ventana-llamadas.component';

describe('VentanaLlamadasComponent', () => {
  let component: VentanaLlamadasComponent;
  let fixture: ComponentFixture<VentanaLlamadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaLlamadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaLlamadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
