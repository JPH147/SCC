import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSalidaVendedoresComponent } from './listado-salida-vendedores.component';

describe('ListadoSalidaVendedoresComponent', () => {
  let component: ListadoSalidaVendedoresComponent;
  let fixture: ComponentFixture<ListadoSalidaVendedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoSalidaVendedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoSalidaVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
