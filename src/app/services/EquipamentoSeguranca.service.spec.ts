/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EquipamentoSegurancaService } from './EquipamentoSeguranca.service';

describe('Service: EquipamentoSeguranca', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquipamentoSegurancaService]
    });
  });

  it('should ...', inject([EquipamentoSegurancaService], (service: EquipamentoSegurancaService) => {
    expect(service).toBeTruthy();
  }));
});
