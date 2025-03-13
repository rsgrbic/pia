import { TestBed } from '@angular/core/testing';

import { FirmaService } from './firma.service';

describe('FirmaService', () => {
  let service: FirmaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirmaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
