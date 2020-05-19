/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FuncionarioService } from './Funcionario.service';

describe('Service: Funcionario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuncionarioService]
    });
  });

  it('should ...', inject([FuncionarioService], (service: FuncionarioService) => {
    expect(service).toBeTruthy();
  }));
});
