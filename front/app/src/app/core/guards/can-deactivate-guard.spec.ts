import { TestBed } from '@angular/core/testing';

import { CanDeactivateGuard } from './can-deactivate-guard';

describe('CanDeactivateGuard', () => {
  let service: CanDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanDeactivateGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
