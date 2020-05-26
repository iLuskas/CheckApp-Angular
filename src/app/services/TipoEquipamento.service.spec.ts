/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TipoEquipamentoService } from './TipoEquipamento.service';

describe('Service: TipoEquipamento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoEquipamentoService]
    });
  });

  it('should ...', inject([TipoEquipamentoService], (service: TipoEquipamentoService) => {
    expect(service).toBeTruthy();
  }));
});
