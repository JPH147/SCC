import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaJuezJuzgadoComponent } from './ventana-juez-juzgado.component';

describe('VentanaJuezJuzgadoComponent', () => {
  let component: VentanaJuezJuzgadoComponent;
  let fixture: ComponentFixture<VentanaJuezJuzgadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaJuezJuzgadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaJuezJuzgadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
