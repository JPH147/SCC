import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroTrabajoPnpComponent } from './centro-trabajo-pnp.component';

describe('CentroTrabajoPnpComponent', () => {
  let component: CentroTrabajoPnpComponent;
  let fixture: ComponentFixture<CentroTrabajoPnpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentroTrabajoPnpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroTrabajoPnpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
