import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaFotoComponent } from './ventana-foto.component';

describe('VentanaFotoComponent', () => {
  let component: VentanaFotoComponent;
  let fixture: ComponentFixture<VentanaFotoComponent>;

  beforeEach(waitForAsync(() => {
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
