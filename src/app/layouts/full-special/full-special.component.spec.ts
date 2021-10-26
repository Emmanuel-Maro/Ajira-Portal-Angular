import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullSpecialComponent } from './full-special.component';

describe('FullSpecialComponent', () => {
  let component: FullSpecialComponent;
  let fixture: ComponentFixture<FullSpecialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullSpecialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
