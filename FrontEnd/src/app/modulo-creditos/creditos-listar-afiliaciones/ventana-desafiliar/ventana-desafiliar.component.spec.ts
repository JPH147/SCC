import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaDesafiliarComponent } from './ventana-desafiliar.component';

describe('VentanaDesafiliarComponent', () => {
  let component: VentanaDesafiliarComponent;
  let fixture: ComponentFixture<VentanaDesafiliarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaDesafiliarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaDesafiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
