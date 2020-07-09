import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { EquipamentoSegurancaDTO } from 'src/app/models/EquipamentoSeguranca';
import { RelatEquipamento } from 'src/app/models/RelatEquipamento';
import { EmpresaClienteDTO } from 'src/app/models/EmpresaClienteDTO';
import { Observable } from 'rxjs';
import { TipoEquipamentoDTO } from 'src/app/models/TipoEquipamentoDTO';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EquipamentoSegurancaService } from 'src/app/services/EquipamentoSeguranca.service';
import { DatePipe } from '@angular/common';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';
import { startWith, map } from 'rxjs/operators';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-equipamentos-read-layout',
  templateUrl: './equipamentos-read-layout.component.html',
  styleUrls: ['./equipamentos-read-layout.component.css']
})
export class EquipamentosReadLayoutComponent implements OnInit {
  private _filtroLista: string;
  formTipoEquip: FormGroup;
  formEmp: FormGroup;
  RangeDatas: FormGroup;
  equipamentos: EquipamentoSegurancaDTO[];
  equipamentosAgenda: RelatEquipamento[];
  empresas: EmpresaClienteDTO[];
  PesquisaPorEmpresa: boolean;
  PesquisaPorTipo: boolean;
  PesquisaPorFabricante: boolean;
  SomenteInspecionados: boolean;
  SomenteNotInspecionados: boolean;
  DataAtual = new Date();
  primeiroDiaMes: Date;
  ultimoDiaMes: Date;
  filteredOptionsTipos: Observable<TipoEquipamentoDTO[]>;
  filteredOptionsEmp: Observable<EmpresaClienteDTO[]>;
  TiposEquips: TipoEquipamentoDTO[];
  TipoEquip: TipoEquipamentoDTO;
  dataSource = new MatTableDataSource<any>(this.equipamentos);
  dataSourceAgenda = new MatTableDataSource<RelatEquipamento>(this.equipamentosAgenda);

  displayedAgendaColumns = [
    "empresa",
    "localizacao",
    "tipo_ext",
    "capacidade_ext",
    "anoFabricacao_ext",
    "num_ext",
    "seloInmetro_ext",
    "fabricante_ext",
    "nomeInspetor",
    "ultimoRecInsp",
    "proximoRecInsp",
    "ultimoRetInsp",
    "proximoRetInsp",
    "estadoCilindroInsp",
    "estadoLocalInsp",
    "seloLacreInsp" ,
    "sinalizacaoPisoInsp",
    "sinalizacaoAcessoInsp",			
    "obsInsp",
    "duracao"
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private _filtrarEmpresas(value: string): EmpresaClienteDTO[] {
    if (!value) return;

    return this.empresas.filter(
      (emp) => emp.razaoSocial.toLowerCase().indexOf(value) !== -1
    );
  }

  constructor(
    private equipamentoService: EquipamentoSegurancaService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private empresaService: EmpresaClienteService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSourceAgenda.paginator = this.paginator
    this.dataSource.sort = this.sort;
    this.dataSourceAgenda.sort = this.sort
  }

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;

    if(this.equipamentosAgenda)
      this.dataSourceAgenda.data = this._filtroLista  ? this.filtrarEquipamentos(this.filtrarLista) : this.equipamentosAgenda;
  }

  ngOnInit(): void {
    this.primeiroDiaMes = new Date(
      this.DataAtual.getFullYear(),
      this.DataAtual.getMonth(),
      1
    );
    this.ultimoDiaMes = new Date(
      this.DataAtual.getFullYear(),
      this.DataAtual.getMonth() + 1,
      0
    );

    this.criaFormRangeDatas();
    this.getRelatEquipamentos();
    this.getAllEmpresas();
  }

  autoCompleteEmpresa(): void {
    this.filteredOptionsEmp = this.formEmp
      .get("razaoSocial")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filtrarEmpresas(value))
      );
  }

  criaFormRangeDatas(): void {
    this.RangeDatas = this.fb.group({
      dataIni: new FormControl(this.primeiroDiaMes),
      dataFim: new FormControl(this.ultimoDiaMes),
    });
  }

  filtrarEquipamentos(value: string): any[] {
    value = value.toLocaleLowerCase();

    if (this.PesquisaPorEmpresa) {
      return this.equipamentosAgenda.filter(
        (equip) => equip.empresa.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorTipo) {
      return this.equipamentosAgenda.filter(
        (equip) => equip.tipo_ext.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorFabricante) {
      return this.equipamentosAgenda.filter(
        (equip) => equip.fabricante_ext.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    return this.equipamentosAgenda;
  }

  getRelatEquipamentos(): void {
    this.equipamentoService
      .getRelatEquipamentos(
        this.transformDate(
          this.RangeDatas.controls.dataIni.value,
          "yyyy-MM-ddT00:00:00"
        ),
        this.transformDate(
          this.RangeDatas.controls.dataFim.value,
          "yyyy-MM-ddT23:59:59"
        )
      )
      .subscribe((equipamentos: RelatEquipamento[]) => {
        this.equipamentosAgenda = equipamentos;
        this.dataSourceAgenda.data = equipamentos;
      });
  }

  PesquisarDatas(): void {
    this.getRelatEquipamentos();
  }

  getAllEmpresas(): void {
    this.empresaService
      .getAllInfoEmpresaCliente()
      .subscribe((emp: EmpresaClienteDTO[]) => {
        this.empresas = emp;
      });
  }

  checkEmpresaChange() {
    if (this.PesquisaPorEmpresa) {
      this.PesquisaPorTipo = false;
      this.PesquisaPorFabricante = false;
    }
  }

  checkTipoChange() {
    if (this.PesquisaPorTipo) {
      this.PesquisaPorEmpresa = false;
      this.PesquisaPorFabricante = false;
    }
  }

  checkFabricanteChange() {
    if (this.PesquisaPorFabricante) {
      this.PesquisaPorEmpresa = false;
      this.PesquisaPorTipo = false;
    }
  }

  checkInspChange() {
    if (this.SomenteInspecionados) {
      this.getRelatEquipamentos();
    }
    else {
      this.equipamentosAgenda = null;
      this.dataSourceAgenda.data = null;
    }
  }

  checkNotInspChange() {
    if (this.SomenteNotInspecionados) {
      this.getRelatEquipamentos();
    }
    else {
      this.equipamentosAgenda = null;
      this.dataSourceAgenda.data = null;
    }
  }

  ExportExcel() {
    let element = document.getElementById("table-equipAgenda");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "EQUIPAMENTOS");

    XLSX.writeFile(
      wb,
      `CHKAPP_EQUIP_INSP_NAOINSP${this.transformDate(this.DataAtual, "yyyyMMddHHmm")}.xlsx`
    );
  }

  transformDate(date: Date, format: string): string {
    return this.datePipe.transform(date, format);
  }

}
