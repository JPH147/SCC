import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEditarSerieComponent } from './ventana-editar-serie.component';

describe('VentanaEditarSerieComponent', () => {
  let component: VentanaEditarSerieComponent;
  let fixture: ComponentFixture<VentanaEditarSerieComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarSerieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
