import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectschoolComponent } from './selectschool.component';

describe('SelectschoolComponent', () => {
  let component: SelectschoolComponent;
  let fixture: ComponentFixture<SelectschoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectschoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectschoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
