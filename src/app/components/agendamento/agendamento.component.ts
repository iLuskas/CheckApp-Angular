import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FuncionarioService } from 'src/app/services/Funcionario.service';
import { EmpresaClienteService } from 'src/app/services/EmpresaCliente.service';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { FuncionarioDTO } from 'src/app/models/FuncionarioDTO';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TipoEquipamentoService } from 'src/app/services/TipoEquipamento.service';
import { TipoEquipamentoDTO } from 'src/app/models/TipoEquipamentoDTO';
import { EmpresaClienteDTO } from 'src/app/models/EmpresaClienteDTO';
import { TipoAgendamentoDTO } from 'src/app/models/TipoAgendamentoDTO';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { registerLocaleData, DatePipe } from '@angular/common';
import { ModeloAgendaInspManut } from 'src/app/models/modelsHelper/ModeloAgendaInspManut';
import { AgendaInspManutDTO } from 'src/app/models/AgendaInspManutDTO';
import { StatusAgendaDTO } from 'src/app/models/StatusAgendaDTO';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderService } from '../template/header/header.service';
import { InspecaoEstadoService } from '../inspecao/inspecao-estado.service';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css']
})
export class AgendamentoComponent implements OnInit, AfterContentInit {
  formAgenda : FormGroup;
  formPesquisa: FormGroup;
  funcionarios: FuncionarioDTO[];
  filteredOptionsFunc: Observable<FuncionarioDTO[]>;
  tiposEquipamentos: TipoEquipamentoDTO[]; 
  tipoEquipamento : TipoEquipamentoDTO;
  tiposAgendamentos: TipoAgendamentoDTO[];
  tipoAgendamento: TipoAgendamentoDTO;
  tiposStatus: StatusAgendaDTO[];
  tipoStatus: StatusAgendaDTO;
  empresas: EmpresaClienteDTO[];
  filteredOptionsEmp: Observable<EmpresaClienteDTO[]>;
  agendamentos: AgendaInspManutDTO[];
  filteredOptionsAgenda: Observable<AgendaInspManutDTO[]>;
  _filtroLista: string = '';
  date = new FormControl(new Date());
  modeloAgendamento: ModeloAgendaInspManut;
  isLoading: boolean;
  pesquisouAgenda: boolean;
  metodoApi: string = 'postAgendamento';
  TipoManutencao: {tipo:string}[] = [
    {tipo: "1º NIVEL"},
    {tipo:"2º NIVEL (ANUAL - RECARGA)"},
    {tipo:"3º NIVEL (A CADA 5 ANOS - RETESTE)"}
  ];
  private formSubmitAttempt: boolean;

  private _filter(value: string): FuncionarioDTO[] {
    if(!value)
      return;

    const filterValue = value.toLowerCase();
    return this.funcionarios.filter(func => func.nome.toLowerCase().indexOf(filterValue) !== -1);
  }

  private _filterEmpresa(value: string): EmpresaClienteDTO[] {
    if (!value) return;

    const filterValue = value.toLowerCase();
    return this.empresas.filter(
      (emp) => emp.razaoSocial.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  private _filterAgendamento(value: string): AgendaInspManutDTO[] {
    if (!value) return;

    return this.agendamentos.filter(
      (emp) => emp.id.toString().indexOf(value) !== -1
    );
  }

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private empresaService: EmpresaClienteService,
    private agendamentoService: AgendamentoService,
    private tipoEquipamentoService: TipoEquipamentoService,
    private datePipe: DatePipe,
    private headerService: HeaderService,
    private estadoInspecao: InspecaoEstadoService
    ) { }

  ngAfterContentInit(): void {
    this.headerService.HeaderData = {
      title: "Agendamentos",
      icone: "event_note",
      routeUrl: "/agendamentos",
    };
  }

  ngOnInit(): void {
    this.formAgenda = this.fb.group({
      id:[''],
      nomeFuncionario: ['', Validators.compose([Validators.required])],
      empresa: ['', Validators.compose([Validators.required])],
      tipoEquipamento: new FormControl('', Validators.compose([Validators.required])),
      tipoAgendamento: ['', Validators.compose([Validators.required])],
      statusInspManut: [''],
      tipoManutencao: [''],
      ocorrenciaInspecao: [false],
      dataInicial: [this.date.value, Validators.compose([Validators.required])],
      dataFinal: [''],
      duracao: [''],
    });

    this.formPesquisa = this.fb.group({
      id: ['']
    });

    this.modeloAgendamento = 
      {
        funcionarioId: 0,
        empresaClienteId: 0,
        tipoAgendamentoId: 0,
        dataInicial: '',
        statusInspManutId: 1,
        tipoEquipamentoId: 0,
        ocorrenciaInspecao: false,
        tipoManutencao: ''
      };    

    this.getAllFuncionario();
    this.getAllEmpresa();
    this.getAllTipoEquipamento();
    this.getAllTipoAgendamento();
    this.getAllAgendamentos();
    this.gettAllStatus();
  }


  autoCompleteFuncionario(): void {
    this.filteredOptionsFunc = this.formAgenda.get('nomeFuncionario')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  autoCompleteEmpresa(): void {
    this.filteredOptionsEmp = this.formAgenda
      .get("empresa")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filterEmpresa(value))
      );
  }

  autoCompleteAgenda(): void {
    this.filteredOptionsAgenda = this.formPesquisa
      .get('id')!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filterAgendamento(value))
      );
  }


  getAllFuncionario() : void {
    this.funcionarioService
      .getAllInfoFuncionario()
      .subscribe(
        (funcionarios: FuncionarioDTO[]) => {
          this.funcionarios = funcionarios;
          this.autoCompleteFuncionario();
      });
  }

  getAllTipoEquipamento(): void {
    this.tipoEquipamentoService
      .getAllTipoEquipamento()
      .subscribe((tipoEquipamento: TipoEquipamentoDTO[]) => {
        this.tiposEquipamentos = tipoEquipamento;
      });
  }

  getAllEmpresa(): void {
    this.empresaService
      .getAllEmpresaCliente()
      .subscribe((empresas: EmpresaClienteDTO[]) => {
        this.empresas = empresas;
        this.autoCompleteEmpresa();
      });
  }

  getAllTipoAgendamento(): void {
    this.agendamentoService
    .getAllTipoAgenda()
    .subscribe((tiposAgendamentos: TipoAgendamentoDTO[]) => {
      this.tiposAgendamentos = tiposAgendamentos;
      this.autoCompleteAgenda();
    });
  }

  getAllAgendamentos() : void {
    this.agendamentoService.getAllAgendamento().subscribe(
      (response: AgendaInspManutDTO[]) => {
        this.agendamentos = response;      
    });
  }

  gettAllStatus(): void {
    this.agendamentoService.getAllStatus().subscribe(
      (response: StatusAgendaDTO[]) => {
        this.tiposStatus = response;      
    });
  }

  selectEmpresa(empresa: EmpresaClienteDTO): void {
    this.modeloAgendamento.empresaClienteId = empresa.id;
  }

  selectFuncionario(funcionario: FuncionarioDTO) : void {
    this.modeloAgendamento.funcionarioId = funcionario.id;
  }

  statusSelecionado(status: any): void {
    this.tipoStatus = this.tiposStatus.find(stt => stt.statusAgenda === status);
    this.modeloAgendamento.statusInspManutId = this.tipoStatus.id;
  }

  tipoEquipamentoSelecionado(tipoEquipamento: TipoEquipamentoDTO): void {
    this.tipoEquipamento = tipoEquipamento;
    this.modeloAgendamento.tipoEquipamentoId = tipoEquipamento.id;
  }

  tipoAgendamentoSelecionado(tipoAgendamento: any): void {
    this.tipoAgendamento = this.tiposAgendamentos.find(agenda => agenda.tipoAgenda === tipoAgendamento);
    this.modeloAgendamento.tipoAgendamentoId = this.tipoAgendamento.id;
  }


  agendar() : void {
   console.log(this.formAgenda.controls.dataInicial.value < this.date.value);
    if(this.formAgenda.controls.dataInicial.value < this.date.value) {
      this.agendamentoService.showMessage("A data precisa ser maior ou igual a data de hoje.", true);
      return;
    }
    this.isLoading = !this.isLoading;
    this.modeloAgendamento.dataInicial = this.transformDate(this.formAgenda.controls.dataInicial.value);    
    if(this.pesquisouAgenda) {
      this.modeloAgendamento.id = this.formAgenda.controls.id.value;
      this.modeloAgendamento.empresaClienteId = this.empresas.find(empresa => empresa.razaoSocial.match(this.formAgenda.controls.empresa.value)).id;
      this.modeloAgendamento.funcionarioId = this.funcionarios.find(func => func.nome.match(this.formAgenda.controls.nomeFuncionario.value)).id;
      this.modeloAgendamento.statusInspManutId = this.tipoStatus.id;
      this.modeloAgendamento.tipoAgendamentoId = this.tipoAgendamento.id;
      this.modeloAgendamento.tipoEquipamentoId = this.tipoEquipamento.id;
    }
    this.modeloAgendamento.tipoManutencao = this.formAgenda.controls.tipoManutencao.value;
    this.modeloAgendamento.ocorrenciaInspecao = this.formAgenda.controls.ocorrenciaInspecao.value;

    this.agendamentoService[this.metodoApi](this.modeloAgendamento).subscribe(
      () => {
        this.agendamentoService.showMessage(
          !this.pesquisouAgenda ?
          "Agendamento cadastrado com sucesso!" :
          "Agendamento alterado com sucesso!");
        this.limparForm();
        this.isLoading = !this.isLoading;
      },
      (error: HttpErrorResponse) =>{
        this.isLoading = !this.isLoading;
        this.agendamentoService.erroHandler(error);
      });
  }

  updateForm(agendamento: AgendaInspManutDTO) {
    this.formAgenda.patchValue(agendamento);
    this.formAgenda.controls.tipoAgendamento.setValue(this.tiposAgendamentos.find(tipoAgenda => tipoAgenda.tipoAgenda.match(this.formAgenda.controls.tipoAgendamento.value)).tipoAgenda);
    this.formAgenda.controls.tipoEquipamento.setValue(this.tiposEquipamentos.find(tipoEquip => tipoEquip.tipo.match(this.formAgenda.controls.tipoEquipamento.value)).tipo);
    this.formAgenda.controls.statusInspManut.setValue(this.tiposStatus.find(status => status.statusAgenda.match(this.formAgenda.controls.statusInspManut.value)).statusAgenda);
    this.tipoAgendamento = this.tiposAgendamentos.find(tipoAgenda => tipoAgenda.tipoAgenda.match(this.formAgenda.controls.tipoAgendamento.value));
    this.tipoEquipamento = this.tiposEquipamentos.find(tipoEquip => tipoEquip.tipo.match(this.formAgenda.controls.tipoEquipamento.value));
    this.tipoStatus = this.tiposStatus.find(status => status.statusAgenda.match(this.formAgenda.controls.statusInspManut.value));
    this.metodoApi = "putAgendamento";
    this.pesquisouAgenda = true;
    this.salvaInfoLocal();
    this.estadoInspecao.isInspetionDone.next(true);
  }

  salvaInfoLocal(): void {
    var infoAgendaSel = {
      ageId: this.formAgenda.controls.id.value,
      funcId: this.funcionarios.find(func => func.nome.match(this.formAgenda.controls.nomeFuncionario.value)).id,
      empId: this.empresas.find(empresa => empresa.razaoSocial.match(this.formAgenda.controls.empresa.value)).id
    }
    localStorage.setItem("AgendaSeleted", JSON.stringify(infoAgendaSel));
  }

  onSerachNumAgendaChange(value) : void {
    if(!value){
      this.limparForm();
    }
  }

  transformDate(date): string {
    return this.datePipe.transform(date, "yyyy-MM-ddTHH:mm:ss");
  }

  compareFn(op1: TipoAgendamentoDTO, op2: TipoAgendamentoDTO) {
    return op1.tipoAgenda === op2.tipoAgenda;
  }

  limparForm() {
    this.formAgenda.reset();
    this.tipoAgendamento = null;
    this.tipoEquipamento = null;
    this.pesquisouAgenda = false;
    this.metodoApi = 'postAgendamento';
    this.getAllFuncionario();
    this.getAllEmpresa();
    this.getAllTipoEquipamento();
    this.getAllTipoAgendamento();
    this.getAllAgendamentos();
    this.gettAllStatus();
  }

  public hasError = (field: string, errorName: string) => {
    return this.formAgenda.controls[field].hasError(errorName);
  };

  isFieldInvalid(field: string) {
    return (
      (!this.formAgenda.get(field).valid &&
        this.formAgenda.get(field).touched) ||
      (this.formAgenda.get(field).untouched && this.formSubmitAttempt)
    );
  }

}
