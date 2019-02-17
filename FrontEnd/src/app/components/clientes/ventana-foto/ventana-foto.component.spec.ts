import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaFotoComponent } from './ventana-foto.component';

describe('VentanaFotoComponent', () => {
  let component: VentanaFotoComponent;
  let fixture: ComponentFixture<VentanaFotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaFotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
