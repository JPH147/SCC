import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaManualListarComponent } from './cobranza-manual-listar.component';

describe('CobranzaManualListarComponent', () => {
  let component: CobranzaManualListarComponent;
  let fixture: ComponentFixture<CobranzaManualListarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaManualListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaManualListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
