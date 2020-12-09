import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditosListarAfiliacionesComponent } from './creditos-listar-afiliaciones.component';

describe('CreditosListarAfiliacionesComponent', () => {
  let component: CreditosListarAfiliacionesComponent;
  let fixture: ComponentFixture<CreditosListarAfiliacionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditosListarAfiliacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosListarAfiliacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
