import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaClienteListarComponent } from './cobranza-cliente-listar.component';

describe('CobranzaClienteListarComponent', () => {
  let component: CobranzaClienteListarComponent;
  let fixture: ComponentFixture<CobranzaClienteListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaClienteListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaClienteListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
