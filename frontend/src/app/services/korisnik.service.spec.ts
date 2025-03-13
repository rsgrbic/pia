import { TestBed } from '@angular/core/testing';

import { korisnikService } from './korisnik.service';

describe('KorisnikService', () => {
  let service: korisnikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(korisnikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
