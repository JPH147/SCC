import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMorosidadComponent } from './reporte-morosidad.component';

describe('ReporteMorosidad.ComponentComponent', () => {
  let component: ReporteMorosidadComponent;
  let fixture: ComponentFixture<ReporteMorosidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteMorosidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMorosidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
