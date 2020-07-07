import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { FuncionarioDTO } from "src/app/models/FuncionarioDTO";
import { TelefoneHelper } from "src/app/models/modelsHelper/TelefoneHelper";
import { EnderecoHelper } from "src/app/models/modelsHelper/EnderecoHelper";
import { Observable } from "rxjs";
import { PerfilDTO } from "src/app/models/PerfilDTO";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { FuncionarioService } from "src/app/services/Funcionario.service";
import { DatePipe } from "@angular/common";
import { PerfilService } from "src/app/services/Perfil.service";
import { startWith, map } from "rxjs/operators";
import * as XLSX from "xlsx";
import { TipoEquipamentoDTO } from "src/app/models/TipoEquipamentoDTO";
import { EmpresaClienteDTO } from "src/app/models/EmpresaClienteDTO";
import { EquipamentoSegurancaDTO } from "src/app/models/EquipamentoSeguranca";
import { TipoEquipamentoService } from "src/app/services/TipoEquipamento.service";
import { EquipamentoSegurancaService } from "src/app/services/EquipamentoSeguranca.service";
import { EmpresaClienteService } from "src/app/services/EmpresaCliente.service";
import { ExtintorDTO } from 'src/app/models/ExtintorDTO';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: "app-equipamento-read",
  templateUrl: "./equipamento-read.component.html",
  styleUrls: ["./equipamento-read.component.css"],
})
export class EquipamentoReadComponent implements OnInit {
  private _filtroLista: string;
  formTipoEquip: FormGroup;
  formEmp: FormGroup;
  RangeDatas: FormGroup;
  equipamentos: EquipamentoSegurancaDTO[];
  empresas: EmpresaClienteDTO[];
  PesquisaPorEmpresa: boolean;
  PesquisaPorTipo: boolean;
  PesquisaPorFabricante: boolean;
  SomenteInspecionados: boolean;
  SomenteNotInspecionados: boolean;
  DataAtual = new Date();
  filteredOptionsEmp: Observable<EmpresaClienteDTO[]>;
  TiposEquips: TipoEquipamentoDTO[];
  TipoEquip: TipoEquipamentoDTO;
  equipFormatado: {
    id?: number;
    empresa: string;
    localizacao_equipamento: string;
    extintorDTO: ExtintorDTO;
  }[] = []; 

  dataSource = new MatTableDataSource<any>(
    this.equipFormatado
  );
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns = [
    "empresa",
    "num_ext",
    "seloInmetro_ext",
    "fabricante_ext",
    "tipo_ext",
    "capacidade_ext",
    "anoFabricacao_ext"
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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
    this.dataSource.sort = this.sort;
  }

  get filtrarLista() {
    return this._filtroLista;
  }

  set filtrarLista(value: string) {
    this._filtroLista = value;
    this.dataSource.data = this._filtroLista
      ? this.filtrarEquipamentos(this.filtrarLista)
      : this.equipFormatado;
  }

  ngOnInit(): void {
    this.criaFormRangeDatas();
    this.getAllEmpresas();
  }

  criaFormRangeDatas(): void {
    this.RangeDatas = this.fb.group({
      dataIni: new FormControl(""),
      dataFim: new FormControl(""),
    });
  }

  filtrarEquipamentos(value: string): any[] {
    value = value.toLocaleLowerCase();

    if (this.PesquisaPorEmpresa) {
      return this.equipFormatado.filter(
        (equip) => equip.empresa.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorTipo) {
      return this.equipFormatado.filter(
        (equip) => equip.extintorDTO.tipo_ext.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    if (this.PesquisaPorFabricante) {
      return this.equipFormatado.filter(
        (equip) => equip.extintorDTO.fabricante_ext.toLocaleLowerCase().indexOf(value) !== -1
      );
    }

    return this.equipFormatado;
  }

  getAllEquipamentos(): void {
    this.equipamentoService
      .getAllEquipamento()
      .subscribe((equipamentos: EquipamentoSegurancaDTO[]) => {
        console.log(equipamentos);
        this.equipamentos = equipamentos;
        equipamentos.forEach(equip =>
          this.equipFormatado.push({
            id: equip.id,
            empresa: this.empresas.find(emp => emp.id === equip.empresaClienteId).razaoSocial,
            extintorDTO: equip.extintorDTO,
            localizacao_equipamento: equip.localizacao_equipamento
          }))

        this.dataSource.data = this.equipFormatado;
      });
  }

  getAllEmpresas(): void {
    this.empresaService
      .getAllInfoEmpresaCliente()
      .subscribe((emp: EmpresaClienteDTO[]) => {
        this.empresas = emp;
        this.getAllEquipamentos();
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

  ExportExcel() {
    let element = document.getElementById("table-equipamentos");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "EQUIPAMENTOS");

    XLSX.writeFile(
      wb,
      `CHKAPP_EQUIPAMENTOS${this.transformDate(this.DataAtual)}.xlsx`
    );
  }

  transformDate(date): string {
    return this.datePipe.transform(date, "yyyyMMddHHmm");
  }
}
