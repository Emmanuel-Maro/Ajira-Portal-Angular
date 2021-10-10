import { TestBed } from '@angular/core/testing';

import { NotService } from './not.service';

describe('NotService', () => {
  let service: NotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
