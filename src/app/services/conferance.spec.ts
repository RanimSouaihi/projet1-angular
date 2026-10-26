import { TestBed } from '@angular/core/testing';

import { Conferance } from './conferance';

describe('Conferance', () => {
  let service: Conferance;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conferance);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
