import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCromogramaComponent } from './ventana-cromograma.component';

describe('VentanaCromogramaComponent', () => {
  let component: VentanaCromogramaComponent;
  let fixture: ComponentFixture<VentanaCromogramaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCromogramaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCromogramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
