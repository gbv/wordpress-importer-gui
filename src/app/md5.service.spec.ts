import { TestBed, inject } from '@angular/core/testing';

import { Md5Service } from './md5.service';

describe('Md5Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Md5Service]
    });
  });

  it('should be created', inject([Md5Service], (service: Md5Service) => {
    expect(service).toBeTruthy();
  }));
});
