import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaDirectaComponent } from './cobranza-directa.component';

describe('CobranzaDirectaComponent', () => {
  let component: CobranzaDirectaComponent;
  let fixture: ComponentFixture<CobranzaDirectaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaDirectaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaDirectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
