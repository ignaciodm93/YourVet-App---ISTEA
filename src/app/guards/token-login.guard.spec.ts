import { TestBed } from '@angular/core/testing';

import { TokenLoginGuard } from './token-login.guard';

describe('TokenLoginGuard', () => {
  let guard: TokenLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TokenLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
