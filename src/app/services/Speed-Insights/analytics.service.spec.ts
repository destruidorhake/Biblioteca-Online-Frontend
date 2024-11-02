import { TestBed } from '@angular/core/testing';

import { ServiceAnalyticsService } from './analytics.service';

describe('ServiceAnalyticsService', () => {
  let service: ServiceAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
