import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperativaConfiguracionComponent } from './cooperativa-configuracion.component';

describe('CooperativaConfiguracionComponent', () => {
  let component: CooperativaConfiguracionComponent;
  let fixture: ComponentFixture<CooperativaConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CooperativaConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperativaConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
