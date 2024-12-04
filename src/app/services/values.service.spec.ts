import { TestBed } from '@angular/core/testing';

import { ValuesService } from './values.service';

describe('ValuesService', () => {
  let service: ValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
