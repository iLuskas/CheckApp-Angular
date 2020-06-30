import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FuncionarioDTO } from 'src/app/models/FuncionarioDTO';
import { TelefoneHelper } from 'src/app/models/modelsHelper/TelefoneHelper';
import { EnderecoHelper } from 'src/app/models/modelsHelper/EnderecoHelper';
import { Observable } from 'rxjs';
import { PerfilDTO } from 'src/app/models/PerfilDTO';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FuncionarioService } from 'src/app/services/Funcionario.service';
import { DatePipe } from '@angular/common';
import { PerfilService } from 'src/app/services/Perfil.service';
import { startWith, map } from 'rxjs/operators';
import * as XLSX from "xlsx";
import { TipoEquipamentoDTO } from 'src/app/models/TipoEquipamentoDTO';
import { EmpresaClienteDTO } from 'src/app/models/EmpresaClienteDTO';
import { EquipamentoSegurancaDTO } from 'src/app/models/EquipamentoSeguranca';
import { TipoEquipamentoService } from 'src/app/services/TipoEquipamento.service';
import { EquipamentoSegurancaService } from 'src/app/services/EquipamentoSeguranca.service';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';
@Component({
  selector: 'app-equipamento-read',
  templateUrl: './equipamento-read.component.html',
  styleUrls: ['./equipamento-read.component.css']
})
export class EquipamentoReadComponent implements OnInit {
  private _filtroLista: string;
  formTipoEquip: FormGroup;
  formEmp: FormGroup;
  equipamentos: EquipamentoSegurancaDTO[];
  empresas: EmpresaClienteDTO[];
  PesquisaPorEmpresa: boolean;
  PesquisaPorTipo: boolean;
  SomenteInspecionados: boolean; 
  SomenteNotInspecionados: boolean;
  DataAtual = new Date();
  filteredOptionsTipos: Observable<TipoEquipamentoDTO[]>;
  filteredOptionsEmp: Observable<EmpresaClienteDTO[]>;
  TiposEquips: TipoEquipamentoDTO[];
  TipoEquip: TipoEquipamentoDTO;
  dataSource = new MatTableDataSource<EquipamentoSegurancaDTO>(this.equipamentos);
  displayedColumns: EquipamentoSegurancaDTO[];
  

  private _filter(value: string): TipoEquipamentoDTO[] {
    if (!value) return;

    const filterValue = value.toLowerCase();
    return this.TiposEquips.filter(
      (perfil) => perfil.tipo.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  private _filtrarEmpresas(value: string): EmpresaClienteDTO[] {
    if (!value) return;

    const filterValue = value.toLowerCase();
      return this.empresas.filter(
        (emp) =>
        emp.razaoSocial.toLowerCase().indexOf(value) !== -1
      );    
  }

  constructor(
    private equipamentoService: EquipamentoSegurancaService,
    private datePipe: DatePipe,
    private tipoEquipamento: TipoEquipamentoService,
    private fb: FormBuilder,
    private empresaService: EmpresaClienteService
  ) {}

  ngAfterViewInit(): void {

  }

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista
      ? this.filtrarEquipamentos(this.filtrarLista)
      : this.equipamentos;

  }

  ngOnInit(): void {
    this.getAllEquipamentos();
    this.criaFormTipo();
    this.criaformEmp();
    this.criaFormGroupEndereco();
    this.criaFormGroupTelefone();
    this.getAllTipos();
    this.getAllEmpresas();
  }

  autoCompleteTipo(): void {
    this.filteredOptionsTipos = this.formTipoEquip
      .get("tipo")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
  }
 
  autoCompleteEmpresa(): void {
    this.filteredOptionsEmp = this.formEmp.get('razaoSocial')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filtrarEmpresas(value))
    );
  }

  criaFormGroupEndereco(): FormGroup {
    return this.fb.group({
      id: [null],
      pais_end: [null],
      estado_end: [null],
      cidade_end: [null],
      bairro_end: [null],
      rua_end: [null],
      numero_end: [null],
      cep_end: [null],
    });
  }

  criaFormGroupTelefone(): FormGroup {
    return this.fb.group({
      id: [null],
      ddd_tel: [null],
      telefone_tel: [null],
    });
  }

  criaformEmp() {
    this.formEmp = this.fb.group({
      id: [null],
      razaoSocial: [""],
      cnpj: [""],
      inscricao_estadual: [""],
      enderecoDTOs: this.fb.array([this.criaFormGroupEndereco()]),
      telefoneDTOs: this.fb.array([this.criaFormGroupTelefone()]),
    });
  }

  criaFormTipo() {
    this.formTipoEquip = this.fb.group({
      id: [null],
      tipo: [""]
    });
  }

  filtrarEquipamentos(value: string): EquipamentoSegurancaDTO[] {
    value = value.toLocaleLowerCase();

    if (this.PesquisaPorTipo) {
      if (this.TipoEquip) {
        return this.equipamentos.filter(
          (equipamento) =>
          equipamento.tipo_equipamentoId
              .toString()
              .toLocaleLowerCase()
              .indexOf(this.TipoEquip.id.toString()) !== -1
        );
      }
    }

    return this.equipamentos;
  }

  getAllEquipamentos(): void {
    this.equipamentoService
      .getAllEquipamento()
      .subscribe((equipamentos: EquipamentoSegurancaDTO[]) => {
        this.equipamentos = equipamentos;
        this.dataSource.data = equipamentos;
      });
  }

  getAllEmpresas(): void {
    this.empresaService
      .getAllInfoEmpresaCliente()
      .subscribe((emp: EmpresaClienteDTO[]) => {
        this.empresas = emp;
        this.autoCompleteEmpresa();
      });
  }

  getAllTipos() {
    this.tipoEquipamento.getAllTipoEquipamento().subscribe((tipos: TipoEquipamentoDTO[]) => {
      this.TiposEquips = tipos;
      this.autoCompleteTipo();
    });
  }

  getPerfil(Tipo: TipoEquipamentoDTO) {
    this.TipoEquip = Tipo;
  }

  getEmpresa(emp: EmpresaClienteDTO) {

  }

  checkEmpresaChange() {
    if (this.PesquisaPorEmpresa) {
      this.PesquisaPorTipo = false;
    }
  }

  checkTipoChange() {
    if (this.PesquisaPorTipo) {
      this.PesquisaPorEmpresa = false;
    }
  }

  ExportExcel() {
    let element = document.getElementById("table-equipmaentos");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "FUNCIONARIOS");

    XLSX.writeFile(
      wb,
      `CHKAPP_EQUIPAMENTOS${this.transformDate(this.DataAtual)}.xlsx`
    );
  }

  transformDate(date): string {
    return this.datePipe.transform(date, "yyyyMMddHHmm");
  }
}
