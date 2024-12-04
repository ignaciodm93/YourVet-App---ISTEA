import { TestBed } from '@angular/core/testing';

import { DatainterceptorInterceptor } from './datainterceptor.interceptor';

describe('DatainterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DatainterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: DatainterceptorInterceptor = TestBed.inject(DatainterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
