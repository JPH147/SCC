import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetornoVendedoresComponent } from './retorno-vendedores.component';

describe('RetornoVendedoresComponent', () => {
  let component: RetornoVendedoresComponent;
  let fixture: ComponentFixture<RetornoVendedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetornoVendedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetornoVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
