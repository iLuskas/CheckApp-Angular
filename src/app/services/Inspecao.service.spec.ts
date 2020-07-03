/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InspecaoService } from './Inspecao.service';

describe('Service: Inspecao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InspecaoService]
    });
  });

  it('should ...', inject([InspecaoService], (service: InspecaoService) => {
    expect(service).toBeTruthy();
  }));
});
