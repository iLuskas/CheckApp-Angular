/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManutencaoService } from './manutencao.service';

describe('Service: Manutencao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManutencaoService]
    });
  });

  it('should ...', inject([ManutencaoService], (service: ManutencaoService) => {
    expect(service).toBeTruthy();
  }));
});
