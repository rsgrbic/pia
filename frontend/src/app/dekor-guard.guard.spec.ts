import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dekorGuardGuard } from './dekor-guard.guard';

describe('dekorGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dekorGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
