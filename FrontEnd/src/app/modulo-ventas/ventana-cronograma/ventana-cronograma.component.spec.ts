import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaCromogramaComponent } from './ventana-cromograma.component';

describe('VentanaCromogramaComponent', () => {
  let component: VentanaCromogramaComponent;
  let fixture: ComponentFixture<VentanaCromogramaComponent>;

  beforeEach(waitForAsync(() => {
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
