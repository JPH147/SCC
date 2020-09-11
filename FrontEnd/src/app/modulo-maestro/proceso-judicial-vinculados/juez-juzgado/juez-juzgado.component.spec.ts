import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuezJuzgadoComponent } from './juez-juzgado.component';

describe('JuezJuzgadoComponent', () => {
  let component: JuezJuzgadoComponent;
  let fixture: ComponentFixture<JuezJuzgadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuezJuzgadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuezJuzgadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
