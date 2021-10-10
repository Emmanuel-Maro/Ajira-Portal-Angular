import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectfacilityComponent } from './selectfacility.component';

describe('SelectfacilityComponent', () => {
  let component: SelectfacilityComponent;
  let fixture: ComponentFixture<SelectfacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectfacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectfacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
