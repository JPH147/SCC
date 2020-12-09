import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaClienteListarComponent } from './cobranza-cliente-listar.component';

describe('CobranzaClienteListarComponent', () => {
  let component: CobranzaClienteListarComponent;
  let fixture: ComponentFixture<CobranzaClienteListarComponent>;

  beforeEach(waitForAsync(() => {
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
