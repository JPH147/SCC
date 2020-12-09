import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetornoVendedoresComponent } from './retorno-vendedores.component';

describe('RetornoVendedoresComponent', () => {
  let component: RetornoVendedoresComponent;
  let fixture: ComponentFixture<RetornoVendedoresComponent>;

  beforeEach(waitForAsync(() => {
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
