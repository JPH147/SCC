import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaClienteListarMorososComponent } from './cobranza-cliente-listar-morosos.component';

describe('CobranzaClienteListarMorososComponent', () => {
  let component: CobranzaClienteListarMorososComponent;
  let fixture: ComponentFixture<CobranzaClienteListarMorososComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaClienteListarMorososComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaClienteListarMorososComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
