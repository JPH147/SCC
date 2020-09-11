import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaVendedoresComponent } from './salida-vendedores.component';

describe('SalidaVendedoresComponent', () => {
  let component: SalidaVendedoresComponent;
  let fixture: ComponentFixture<SalidaVendedoresComponent>;

  beforeEach(async(() => {
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
