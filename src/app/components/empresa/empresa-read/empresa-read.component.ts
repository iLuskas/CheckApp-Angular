import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpresaClienteDTO } from 'src/app/models/EmpresaClienteDTO';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-empresa-read',
  templateUrl: './empresa-read.component.html',
  styleUrls: ['./empresa-read.component.css']
})
export class EmpresaReadComponent implements OnInit {
  private _filtroLista: string;
  empresas: EmpresaClienteDTO[];
  dataSource = new MatTableDataSource<EmpresaClienteDTO>(this.empresas);
  displayedColumns = ['id', 'razaoSocial', 'cnpj', 'inscricao_estadual', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(private empresaService: EmpresaClienteService,
    private router: Router) { }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista ? this.filtrarEmpresas(this.filtroLista) : this.empresas;
  }

  ngOnInit(): void {
    this.getAllEmpresas();
    this.dataSource.paginator = this.paginator;
  }

  filtrarEmpresas(value: string): EmpresaClienteDTO[] {
    value = value.toLocaleLowerCase();
    return this.empresas.filter(
      empresas => empresas.razaoSocial.toLocaleLowerCase().indexOf(value) !== -1
    );
  }


  getAllEmpresas()
  {
    this.empresaService.getAllInfoEmpresaCliente().subscribe(
      (empresas: EmpresaClienteDTO[]) => {
        this.empresas = empresas;
        this.dataSource.data = empresas;
        console.log(this.empresas);
      }
    );
  }

  navigateToCreate() {
    this.router.navigate(['/empresas/create']);
  }

}
