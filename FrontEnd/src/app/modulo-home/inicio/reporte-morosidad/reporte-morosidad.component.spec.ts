import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReporteMorosidadComponent } from './reporte-morosidad.component';

describe('ReporteMorosidad.ComponentComponent', () => {
  let component: ReporteMorosidadComponent;
  let fixture: ComponentFixture<ReporteMorosidadComponent>;

  beforeEach(waitForAsync(() => {
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
