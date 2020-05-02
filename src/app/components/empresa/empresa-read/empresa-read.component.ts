import { Component, OnInit } from '@angular/core';
import { EmpresaClienteDTO } from 'src/app/models/EmpresaClienteDTO';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';

@Component({
  selector: 'app-empresa-read',
  templateUrl: './empresa-read.component.html',
  styleUrls: ['./empresa-read.component.css']
})
export class EmpresaReadComponent implements OnInit {

  empresas: EmpresaClienteDTO[];

  displayedColumns = ['id', 'razaoSocial', 'cnpj', 'inscricao_estadual', 'action'];

  constructor(private empresaService: EmpresaClienteService) { }

  ngOnInit(): void {
    this.getAllEmpresas();
  }

  getAllEmpresas()
  {
    this.empresaService.getAllInfoEmpresaCliente().subscribe(
      (empresas: EmpresaClienteDTO[]) => {
        this.empresas = empresas
        console.log(this.empresas);
      }
    );
  }

}
