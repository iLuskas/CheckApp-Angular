import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { EquipamentoSegurancaDTO } from "src/app/models/EquipamentoSeguranca";
import { EmpresaClienteDTO } from "src/app/models/EmpresaClienteDTO";
import { TipoEquipamentoDTO } from "src/app/models/TipoEquipamentoDTO";
import { ExtintorDTO } from "src/app/models/ExtintorDTO";
import { Router } from "@angular/router";
import { EquipamentoSegurancaService } from "src/app/services/EquipamentoSeguranca.service";
import { EmpresaClienteService } from "src/app/services/EmpresaCliente.service";
import { TipoEquipamentoService } from "src/app/services/TipoEquipamento.service";
import { Observable } from "rxjs";
import { startWith, map, take } from "rxjs/operators";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { DatePipe } from '@angular/common';
import { compileNgModule } from '@angular/compiler';

@Component({
  selector: "app-equipamento-create",
  templateUrl: "./equipamento-create.component.html",
  styleUrls: ["./equipamento-create.component.css"],
})
export class EquipamentoCreateComponent implements OnInit {
  formCreate: FormGroup;
  formCreateEmpresa: FormGroup;
  formCreateTipoEquipamento: FormGroup;
  equipamentosSegurancas: EquipamentoSegurancaDTO[];
  equipamentoSeguranca: EquipamentoSegurancaDTO;
  empresas: EmpresaClienteDTO[];
  empresa: EmpresaClienteDTO;
  tiposEquipamentos: TipoEquipamentoDTO[];
  tipoEquipamento: TipoEquipamentoDTO;
  extintores: ExtintorDTO[] = [];
  extintor: ExtintorDTO;
  filteredEmpresas: Observable<EmpresaClienteDTO[]>;
  filteredExtintor: Observable<ExtintorDTO[]>;
  UpdateOrDelete: boolean = false;
  qrData: string = '';
  date = new FormControl(new Date());
  hrefQrCode : string;
  display: boolean = false;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  isLoading: boolean;
  metodoApi: string = 'postEquipamento';
  dateMonthYear: { id: number; date: string }[] = [];
  tipoExtintor: {tipo: string; peso: string}[] = [
    {tipo: "ÁGUA", peso: "LT"},
    {tipo: "EM", peso: "LT"},
    {tipo: "CLA K", peso: "LT"},
    {tipo: "AMP CO2", peso: "KG"},
    {tipo: "AMP N2", peso: "KG"},
    {tipo: "FE36", peso: "KG"},
    {tipo: "CO2", peso: "KG"},
    {tipo: "PQS ABC", peso: "KG"},
    {tipo: "PQS BC", peso: "KG"},
    {tipo: "CLA D", peso: "KG"}
  ];
  pesoExtintor: string = "";
  private formSubmitAttempt: boolean;
  @ViewChild("autosize") autosize: CdkTextareaAutosize;

  private _filterEmpresa(value: string): EmpresaClienteDTO[] {
    if (!value) return;

    const filterValue = value.toLowerCase();
    return this.empresas.filter(
      (emp) => emp.razaoSocial.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  private filtrarEquipamento(value: number): EquipamentoSegurancaDTO {
    return this.equipamentosSegurancas.find(equi => equi.id === value);
  }

  private _filterExtintor(value: string): ExtintorDTO[] {
    if (!value) return;
    
    return this.extintores.filter(
      (ex) => ex.num_ext.toString().indexOf(value) !== -1
    );
  }

  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
    private equipamentoService: EquipamentoSegurancaService,
    private empresaService: EmpresaClienteService,
    private tipoEquipamentoService: TipoEquipamentoService,
    private datePipe : DatePipe
  ) {}

  ngOnInit(): void {
    this.criarFormCreate();
    this.criaformCreateEmpresa();
    this.criaFormCreateTipoEquipamento();
    this.getAllTipoEquipamento();
    this.getAllEmpresa();
    this.createDropdownMonthYear();
  }

  triggerResize() {
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  autoCompleteEmpresa(): void {
    this.filteredEmpresas = this.formCreateEmpresa
      .get("razaoSocial")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filterEmpresa(value))
      );
  }

  autoCompleteExtintor(): void {
    const formGroup = <FormGroup>this.formCreate.get('extintorDTO');
    this.filteredExtintor = formGroup.get('num_ext')!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filterExtintor(value))
      );
  }

  criaFormCreateTipoEquipamento(): void {
    this.formCreateTipoEquipamento = this.fb.group({
      id: [null],
      tipo: ["", Validators.required],
    });
  }

  criaformCreateEmpresa() {
    this.formCreateEmpresa = this.fb.group({
      id: [null],
      razaoSocial: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      cnpj: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(14),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      inscricao_estadual: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(14),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      enderecoDTOs: [null],
      telefoneDTOs: [null],
    });
  }

  criaFormCreateExtintor(): FormGroup {
    return this.fb.group({
      id: [null],
      equipamentoId: [null],
      num_ext: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      seloInmetro_ext: ['', Validators.compose([Validators.required, Validators.maxLength(14), Validators.pattern("^[0-9]*$")])],
      fabricante_ext: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      tipo_ext: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      capacidade_ext: [null, Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      anoFabricacao_ext: ['', Validators.compose([Validators.required, Validators.maxLength(4), Validators.pattern("^[0-9]*$")])],
    });
  }

  criarFormCreate(): void {

    this.formCreate = this.fb.group({
      id: [null],
      tipo_equipamentoId: [null],
      empresaClienteId: [null],
      localizacao_equipamento: ['', Validators.compose([Validators.required])],
      qrCode: [''],
      qrcode_data_geracao: [null], 
      dataCriacao_equipamento: [this.date.value, Validators.compose([Validators.required])],
      extintorDTO: this.criaFormCreateExtintor(),
    });
  }

  getAllEquipamentoByEmpresaIdAndTipo(id: number, tipoId: number): void {
    this.equipamentoService
      .getAllEquipamentoByEmpresaIdAndTipo(id.toString(), tipoId.toString())
      .subscribe((equipamentos: EquipamentoSegurancaDTO[]) => {
        this.equipamentosSegurancas = equipamentos;
        this.equipamentosSegurancas.forEach(eq => this.extintores.push(eq.extintorDTO));
        this.autoCompleteExtintor();
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

  salvarEquipamento(stepper: any) {
    this.isLoading = !this.isLoading;
    this.equipamentoSeguranca = this.formCreate.value;
    this.equipamentoSeguranca.qrCode = this.qrData;
    this.equipamentoService[this.metodoApi](this.equipamentoSeguranca).subscribe(
      () =>{
        this.equipamentoService.showMessage(
          !this.UpdateOrDelete ?
          "Equipamento criado com sucesso!" :
          "Equipamento alterado com sucesso!"
          );
        this.limparForm(stepper);
        this.isLoading = !this.isLoading;
      }
    );
  }


  deleteEquipamento(stepper: any) {
    this.isLoading = !this.isLoading;
    this.equipamentoSeguranca = this.formCreate.value;
    this.equipamentoService
      .deleteEquipamento(this.equipamentoSeguranca)
      .subscribe(() => {
        this.equipamentoService.showMessage("Equipamento removido com sucesso!");
        this.limparForm(stepper);
        this.isLoading = !this.isLoading;
      });
  }

  createTipoEquipamento(tipo: any) : void {
    
    if(tipo === ''){
      this.tipoEquipamentoService.showMessage('Favor informe o tipo do equipamento.', true);
      return;
    }

    this.formCreateTipoEquipamento.controls['tipo'].patchValue(tipo);
    this.tipoEquipamento = this.formCreateTipoEquipamento.value;
    this.tipoEquipamentoService.postTipoEquipamento(this.tipoEquipamento).subscribe(
      () => {
        this.tipoEquipamentoService.showMessage("Tipo de Equipamento criado com sucesso.");
        this.getAllTipoEquipamento();
      }
    );
  }

  tipoEquipamentoSelecionado(tipoEquipamento: TipoEquipamentoDTO): void {
    this.tipoEquipamento = tipoEquipamento;
    this.formCreateTipoEquipamento.patchValue(tipoEquipamento);
    this.formCreate.controls["tipo_equipamentoId"].patchValue(
      tipoEquipamento.id
    );

    this.getAllEquipamentoByEmpresaIdAndTipo(
      this.formCreate.controls["empresaClienteId"].value,
      tipoEquipamento.id
    );
  }

  selectEmpresa(empresa: EmpresaClienteDTO) {
    this.formCreateEmpresa.patchValue(empresa);
    this.formCreate.controls["empresaClienteId"].patchValue(empresa.id);
  }

  selectExtintor(extintor: ExtintorDTO): void {
    let equipamentoSeguranca = this.filtrarEquipamento(extintor.equipamentoId);
    this.formCreate.patchValue(equipamentoSeguranca);
    this.qrData = this.formCreate.controls['qrCode'].value;
    this.display = this.qrData ? true : false;
    this.UpdateOrDelete = true;
    this.metodoApi = "putEquipamento";
  }

  GerarQrCode() {
    if(!this.formCreate.valid) return;
    this.formCreate.controls['qrcode_data_geracao'].patchValue(this.date.value);  

    let jsongrCode = {
      num_ext: this.formCreate.controls.extintorDTO.get('num_ext').value
    };

    this.qrData = JSON.stringify(jsongrCode);
    this.display = true;
  }

  downloadImage(){
    this.hrefQrCode = document.getElementsByTagName('img')[1].src;
  }

  getNomenclaturaQrCode(): string {
    const formGroup = this.formCreate.get("extintorDTO") as FormGroup;
    return `QrCode_${formGroup.controls['num_ext'].value}`
  }

  createDropdownMonthYear(): void {
    var date = new Date();
    let id: number = 0;
    var currentYear = date.getFullYear();
    var months;
    months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    for (var i = 0; i <= 5; i++) {
      for (const key in months) {
        if (months.hasOwnProperty(key)) {
          const element = months[key];
          this.dateMonthYear.push({
            id: id++,
            date: `${element}-${(currentYear + i).toString().substring(2, 4)}`,
          });
        }
      }
    }
  }

  SelectionTipoChange(value) : void {
    this.pesoExtintor = this.tipoExtintor.find(tipo => tipo.tipo === value).peso;   
  }

  limparForm(stepper: any = null) {
    if (stepper) stepper.reset();

    this.formCreate.reset();
    this.formCreate.controls['dataCriacao_equipamento'].patchValue(this.date.value);
    this.formCreateEmpresa.reset();
    this.empresa = null;
    this.formCreateTipoEquipamento.reset();
    this.tipoEquipamento = null;
    this.getAllEmpresa();
    this.getAllTipoEquipamento();
    this.extintores = [];
    this.UpdateOrDelete = false;
    this.qrData = "";
    this.display = false;
    this.metodoApi = 'postEquipamento';
  }

  onSearchChange(searchValue: string): void { 
    if(!searchValue){
      const formGroup = this.formCreate.get("extintorDTO") as FormGroup;
      formGroup.reset();
      this.UpdateOrDelete = false;
      this.qrData = "";
      this.display = false;
      this.formCreate.controls['localizacao_equipamento'].patchValue("");
    }      
  }

  onSearchEmpChange(searchValue: string): void {
    if(!searchValue){ 
      this.limparForm();
    }
  }

  isFieldExtintorInvalid(field: string) {
    const formGroup = this.formCreate.get("extintorDTO") as FormGroup;
    return (
      (!formGroup.controls[field].valid && formGroup.controls[field].touched) ||
      (formGroup.controls[field].untouched && this.formSubmitAttempt)
    );
  }

  hasErrorFieldExtintor(field: string, error: string) {
    const formGroup = this.formCreate.get("extintorDTO") as FormGroup;
    return formGroup.controls[field].hasError(error);
  }

  public hasError = (field: string, errorName: string) => {
    return this.formCreate.controls[field].hasError(errorName);
  };

  isFieldInvalid(field: string) {
    return (
      (!this.formCreate.get(field).valid &&
        this.formCreate.get(field).touched) ||
      (this.formCreate.get(field).untouched && this.formSubmitAttempt)
    );
  }
}
