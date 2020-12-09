import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetornoVendedoresCierreComponent } from './retorno-vendedores-cierre.component';

describe('RetornoVendedoresCierreComponent', () => {
  let component: RetornoVendedoresCierreComponent;
  let fixture: ComponentFixture<RetornoVendedoresCierreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetornoVendedoresCierreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetornoVendedoresCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
