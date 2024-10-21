import { TestBed } from '@angular/core/testing';

import { PratileiraService } from './pratileira.service';

describe('PratileiraService', () => {
  let service: PratileiraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PratileiraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
