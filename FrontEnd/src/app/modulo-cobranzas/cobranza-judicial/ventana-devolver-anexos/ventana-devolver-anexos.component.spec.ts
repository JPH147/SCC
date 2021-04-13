import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaDevolverAnexosComponent } from './ventana-devolver-anexos.component';

describe('VentanaDevolverAnexosComponent', () => {
  let component: VentanaDevolverAnexosComponent;
  let fixture: ComponentFixture<VentanaDevolverAnexosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaDevolverAnexosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaDevolverAnexosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
