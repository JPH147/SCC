import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialSerieComponent } from './historial-serie.component';

describe('HistorialSerieComponent', () => {
  let component: HistorialSerieComponent;
  let fixture: ComponentFixture<HistorialSerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialSerieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
