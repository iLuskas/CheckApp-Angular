/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmpresaClienteService } from './EmpresaCliente.service';

describe('Service: EmpresaCliente', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmpresaClienteService]
    });
  });

  it('should ...', inject([EmpresaClienteService], (service: EmpresaClienteService) => {
    expect(service).toBeTruthy();
  }));
});
