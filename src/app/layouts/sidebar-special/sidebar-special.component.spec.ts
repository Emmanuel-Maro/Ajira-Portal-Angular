import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSpecialComponent } from './sidebar-special.component';

describe('SidebarSpecialComponent', () => {
  let component: SidebarSpecialComponent;
  let fixture: ComponentFixture<SidebarSpecialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarSpecialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
