import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEditarSerieComponent } from './ventana-editar-serie.component';

describe('VentanaEditarSerieComponent', () => {
  let component: VentanaEditarSerieComponent;
  let fixture: ComponentFixture<VentanaEditarSerieComponent>;

  beforeEach(async(() => {
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
