import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { EmpresaClienteDTO } from "src/app/models/EmpresaClienteDTO";
import { EmpresaClienteService } from "src/app/services/EmpresaCliente.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import * as XLSX from "xlsx";
import { DatePipe } from "@angular/common";
import { TelefoneHelper } from "src/app/models/modelsHelper/TelefoneHelper";
import { EnderecoHelper } from 'src/app/models/modelsHelper/EnderecoHelper';
@Component({
  selector: "app-empresa-read",
  templateUrl: "./empresa-read.component.html",
  styleUrls: ["./empresa-read.component.css"],
})
export class EmpresaReadComponent implements OnInit, AfterViewInit {
  private _filtroLista: string;
  empresas: EmpresaClienteDTO[];
  PesquisaPorCnpj: boolean;
  PesquisaPorRazaoSocial: boolean;
  PesquisaPorInscricao: boolean;
  IncluirEndereco: boolean = false;
  IncluirTelefone: boolean;
  DataAtual = new Date();
  telefones: TelefoneHelper[];
  enderecos: EnderecoHelper[];
  dataSource = new MatTableDataSource<EmpresaClienteDTO>(this.empresas);
  dataSourceTelefone = new MatTableDataSource<TelefoneHelper>(this.telefones);
  dataSourceEndereco = new MatTableDataSource<EnderecoHelper>(this.enderecos);
  displayedColumns = ["id", "razaoSocial", "cnpj", "inscricao_estadual"];
  displayedColumnsTelefone = ["nomeEmpresa", "ddd", "telefone"];
  displayedColumnsEndereco = ["nomeEmpresa", "cep_end",  "cidade_end", "bairro_end", "rua_end", "numero_end", "estado_end", "pais_end"];
  @ViewChild('paginatorEmpresa') paginatorEmpresa: MatPaginator;
  @ViewChild('paginatorTelefone') paginatorTelefone: MatPaginator;
  @ViewChild('paginatorEndereco') paginatorEndereco: MatPaginator;
  constructor(
    private empresaService: EmpresaClienteService,
    private datePipe: DatePipe
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorEmpresa;
    this.dataSourceTelefone.paginator = this.paginatorTelefone;
    this.dataSourceEndereco.paginator = this.paginatorEndereco;
  }

  get filtroLista() {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista
      ? this.filtrarEmpresas(this.filtroLista)
      : this.empresas;

    this.incluirTelChange(this.dataSource.data);
    this.incluirEndChange(this.dataSource.data);
  }

  ngOnInit(): void {
    this.getAllEmpresas();
  }

  filtrarEmpresas(value: string): EmpresaClienteDTO[] {
    value = value.toLocaleLowerCase();
    if (this.PesquisaPorRazaoSocial) {
      return this.empresas.filter(
        (empresas) =>
          empresas.razaoSocial.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorCnpj) {
      return this.empresas.filter(
        (empresas) => empresas.cnpj.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorInscricao) {
      return this.empresas.filter(
        (empresas) =>
          empresas.inscricao_estadual.toLocaleLowerCase().indexOf(value) !== -1
      );
    }
  }

  getAllEmpresas() {
    this.empresaService
      .getAllInfoEmpresaCliente()
      .subscribe((empresas: EmpresaClienteDTO[]) => {
        this.empresas = empresas;
        this.dataSource.data = empresas;
        this.incluirTelChange(this.empresas);
        this.incluirEndChange(this.empresas);
      });
  }

  checkCnpjChange() {
    if (!this.PesquisaPorCnpj) {
      this.PesquisaPorInscricao = false;
      this.PesquisaPorRazaoSocial = false;
    }
  }

  checkRazaoSocialChange() {
    if (!this.PesquisaPorRazaoSocial) {
      this.PesquisaPorInscricao = false;
      this.PesquisaPorCnpj = false;
    }
  }

  checkInscricaoChange() {
    if (!this.PesquisaPorInscricao) {
      this.PesquisaPorCnpj = false;
      this.PesquisaPorRazaoSocial = false;
    }
  }

  incluirTelChange(empresa: EmpresaClienteDTO[]) {
    this.telefones = [];
    empresa.forEach((empresa) =>
      empresa.telefoneDTOs.forEach((telefone) =>
        this.telefones.push({
          nomeEmpresa: empresa.razaoSocial,
          telefone: telefone.telefone_tel,
          ddd: telefone.ddd_tel,
        })
      )
    );
    this.dataSourceTelefone.data = this.telefones;
  }

  incluirEndChange(empresa: EmpresaClienteDTO[]) {
    this.enderecos = [];
    empresa.forEach((empresa) =>
      empresa.enderecoDTOs.forEach((endereco) =>
        this.enderecos.push({
          nomeEmpresa: empresa.razaoSocial,
          bairro_end: endereco.bairro_end,
          cep_end: endereco.cep_end,
          cidade_end: endereco.cidade_end,
          estado_end: endereco.estado_end,
          numero_end: endereco.numero_end,
          pais_end: endereco.pais_end,
          rua_end: endereco.rua_end
        })
      )
    );
    this.dataSourceEndereco.data = this.enderecos;
  }

  ExportExcel() {
    let element = document.getElementById("table-Empresas");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "EMPRESAS");

    if(this.IncluirEndereco) {
      let element2 = document.getElementById("table-endereco");
      const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element2);
  
      XLSX.utils.book_append_sheet(wb, ws2, "ENDEREÇOS");
    }

    if(this.IncluirTelefone) {
      let element3 = document.getElementById("table-telefone");
      const ws3: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element3);
  
      XLSX.utils.book_append_sheet(wb, ws3, "TELEFONES");
    }

    XLSX.writeFile(wb, `CHKAPP_EMPRESAS${this.transformDate(this.DataAtual)}.xlsx`);
  }

  transformDate(date): string {
    return this.datePipe.transform(date, "yyyyMMddHHmm");
  }
}
