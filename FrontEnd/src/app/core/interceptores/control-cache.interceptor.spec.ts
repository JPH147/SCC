import { TestBed } from '@angular/core/testing';

import { ControlCacheInterceptor } from './control-cache.interceptor';

describe('ControlCacheInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ControlCacheInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ControlCacheInterceptor = TestBed.inject(ControlCacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
