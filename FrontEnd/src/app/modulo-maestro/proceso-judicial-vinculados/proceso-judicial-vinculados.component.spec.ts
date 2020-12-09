import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProcesoJudicialVinculadosComponent } from './proceso-judicial-vinculados.component';

describe('ProcesoJudicialVinculadosComponent', () => {
  let component: ProcesoJudicialVinculadosComponent;
  let fixture: ComponentFixture<ProcesoJudicialVinculadosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesoJudicialVinculadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoJudicialVinculadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
