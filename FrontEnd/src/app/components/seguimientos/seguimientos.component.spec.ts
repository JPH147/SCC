import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientosComponent } from './seguimientos.component';

describe('SeguimientosComponent', () => {
  let component: SeguimientosComponent;
  let fixture: ComponentFixture<SeguimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
