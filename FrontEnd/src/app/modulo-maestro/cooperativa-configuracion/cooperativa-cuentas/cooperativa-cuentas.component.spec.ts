import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperativaCuentasComponent } from './cooperativa-cuentas.component';

describe('CooperativaCuentasComponent', () => {
  let component: CooperativaCuentasComponent;
  let fixture: ComponentFixture<CooperativaCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CooperativaCuentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperativaCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
