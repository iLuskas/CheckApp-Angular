import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FuncionarioDTO } from "src/app/models/FuncionarioDTO";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { FuncionarioService } from "src/app/services/Funcionario.service";
import { Router } from "@angular/router";
import { TelefoneHelper } from "src/app/models/modelsHelper/TelefoneHelper";
import { EnderecoHelper } from "src/app/models/modelsHelper/EnderecoHelper";
import * as XLSX from "xlsx";
import { DatePipe } from "@angular/common";
import { PerfilDTO } from "src/app/models/PerfilDTO";
import { Observable, EMPTY } from "rxjs";
import { PerfilService } from "src/app/services/Perfil.service";
import { startWith, map } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "app-funcionario-read",
  templateUrl: "./funcionario-read.component.html",
  styleUrls: ["./funcionario-read.component.css"],
})
export class FuncionarioReadComponent implements OnInit, AfterViewInit {
  private _filtroLista: string;
  formPerfil: FormGroup;
  funcionarios: FuncionarioDTO[];
  PesquisaPorNome: boolean;
  PesquisaPorCPF: boolean;
  PesquisaPorPerfil: boolean;
  IncluirEndereco: boolean;
  IncluirTelefone: boolean;
  DataAtual = new Date();
  telefones: TelefoneHelper[];
  enderecos: EnderecoHelper[];
  filteredOptions: Observable<PerfilDTO[]>;
  perfils: PerfilDTO[];
  perfil: PerfilDTO;
  dataSourceTelefone = new MatTableDataSource<TelefoneHelper>(this.telefones);
  dataSourceEndereco = new MatTableDataSource<EnderecoHelper>(this.enderecos);
  displayedColumnsTelefone = ["nomeFuncionario", "ddd", "telefone"];
  displayedColumnsEndereco = [
    "nomeFuncionario",
    "cep_end",
    "cidade_end",
    "bairro_end",
    "rua_end",
    "numero_end",
    "estado_end",
    "pais_end",
  ];
  dataSource = new MatTableDataSource<FuncionarioDTO>(this.funcionarios);
  displayedColumns = ["id", "nome", "cpf", "email"];
  @ViewChild("paginatorFuncionario") paginatorFuncionario: MatPaginator;
  @ViewChild("paginatorTelefone") paginatorTelefone: MatPaginator;
  @ViewChild("paginatorEndereco") paginatorEndereco: MatPaginator;

  private _filter(value: string): PerfilDTO[] {
    if (!value) return;

    const filterValue = value.toLowerCase();
    return this.perfils.filter(
      (perfil) => perfil.funcao_perfil.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  constructor(
    private funcionarioService: FuncionarioService,
    private datePipe: DatePipe,
    private perfilService: PerfilService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorFuncionario;
    this.dataSourceEndereco.paginator = this.paginatorEndereco;
  }

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista
      ? this.filtrarFuncionarios(this.filtrarLista)
      : this.funcionarios;

    this.incluirEndChange(this.dataSource.data);
    this.incluirTelChange(this.dataSource.data);
  }

  ngOnInit(): void {
    this.getAllFuncionarios();
    this.criaFormPerfil();
    this.getAllPerfils();
  }

  autoCompletePerfil(): void {
    this.filteredOptions = this.formPerfil
      .get("funcao_perfil")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
  }

  criaFormPerfil() {
    this.formPerfil = this.fb.group({
      id: [null],
      funcao_perfil: [""],
    });
  }

  filtrarFuncionarios(value: string): FuncionarioDTO[] {
    value = value.toLocaleLowerCase();

    if (this.PesquisaPorNome) {
      return this.funcionarios.filter(
        (funcionarios) =>
          funcionarios.nome.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorCPF) {
      return this.funcionarios.filter(
        (funcionarios) =>
          funcionarios.cpf.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorPerfil) {
      if (this.perfil) {
        console.log('perfil', this.perfil)
        return this.funcionarios.filter(
          (funcionarios) =>
            funcionarios.perfilId
              .toString()
              .toLocaleLowerCase()
              .indexOf(this.perfil.id.toString()) !== -1
        );
      }
    }

    return this.funcionarios;
  }

  getAllFuncionarios(): void {
    this.funcionarioService
      .getAllInfoFuncionario()
      .subscribe((funcionarios: FuncionarioDTO[]) => {
        this.funcionarios = funcionarios;
        this.dataSource.data = funcionarios;
        this.incluirTelChange(this.funcionarios);
        this.incluirEndChange(this.funcionarios);
      });
  }

  getAllPerfils() {
    this.perfilService.getAllPerfil().subscribe((perfils: PerfilDTO[]) => {
      this.perfils = perfils;
      this.autoCompletePerfil();
      console.log(this.perfils);
    });
  }

  getPerfil(perfil: PerfilDTO) {
    this.perfil = perfil;
  }

  checkCpfChange() {
    if (this.PesquisaPorCPF) {
      this.PesquisaPorNome = false;
      this.PesquisaPorPerfil = false;
    }
  }

  checkNomeChange() {
    if (this.PesquisaPorNome) {
      this.PesquisaPorCPF = false;
      this.PesquisaPorPerfil = false;
    }
  }

  checkPerfilChange() {
    if (this.PesquisaPorPerfil) {
      this.PesquisaPorCPF = false;
      this.PesquisaPorNome = false;
    }
  }

  incluirTelChange(funcionarios: FuncionarioDTO[]) {
    this.telefones = [];
    funcionarios.forEach((funcionario) =>
      funcionario.telefoneDTOs.forEach((telefone) =>
        this.telefones.push({
          nomeFuncionario: funcionario.nome,
          telefone: telefone.telefone_tel,
          ddd: telefone.ddd_tel,
        })
      )
    );
    this.dataSourceTelefone.data = this.telefones;
  }

  incluirEndChange(funcionarios: FuncionarioDTO[]) {
    this.enderecos = [];
    funcionarios.forEach((funcionario) =>
      funcionario.enderecoDTOs.forEach((endereco) =>
        this.enderecos.push({
          nomeFuncionario: funcionario.nome,
          bairro_end: endereco.bairro_end,
          cep_end: endereco.cep_end,
          cidade_end: endereco.cidade_end,
          estado_end: endereco.estado_end,
          numero_end: endereco.numero_end,
          pais_end: endereco.pais_end,
          rua_end: endereco.rua_end,
        })
      )
    );
    this.dataSourceEndereco.data = this.enderecos;
  }

  ExportExcel() {
    let element = document.getElementById("table-funcionario");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "FUNCIONARIOS");

    if (this.IncluirEndereco) {
      let element2 = document.getElementById("table-endereco");
      const ws2: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element2);

      XLSX.utils.book_append_sheet(wb, ws2, "ENDEREÇOS");
    }

    if (this.IncluirTelefone) {
      let element3 = document.getElementById("table-telefone");
      const ws3: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element3);

      XLSX.utils.book_append_sheet(wb, ws3, "TELEFONES");
    }

    XLSX.writeFile(
      wb,
      `CHKAPP_FUNCIONARIOS${this.transformDate(this.DataAtual)}.xlsx`
    );
  }

  transformDate(date): string {
    return this.datePipe.transform(date, "yyyyMMddHHmm");
  }
}
