import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachletterComponent } from './attachletter.component';

describe('AttachletterComponent', () => {
  let component: AttachletterComponent;
  let fixture: ComponentFixture<AttachletterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachletterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
