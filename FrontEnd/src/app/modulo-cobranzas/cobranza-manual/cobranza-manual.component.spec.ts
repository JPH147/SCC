import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaManualComponent } from './cobranza-manual.component';

describe('CobranzaManualComponent', () => {
  let component: CobranzaManualComponent;
  let fixture: ComponentFixture<CobranzaManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
