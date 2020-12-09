import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SalidaVendedoresComponent } from './salida-vendedores.component';

describe('SalidaVendedoresComponent', () => {
  let component: SalidaVendedoresComponent;
  let fixture: ComponentFixture<SalidaVendedoresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SalidaVendedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
