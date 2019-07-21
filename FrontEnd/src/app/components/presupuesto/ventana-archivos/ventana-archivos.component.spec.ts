import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaArchivosComponent } from './ventana-archivos.component';

describe('VentanaArchivosComponent', () => {
  let component: VentanaArchivosComponent;
  let fixture: ComponentFixture<VentanaArchivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaArchivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
