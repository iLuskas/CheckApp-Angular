import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from "@angular/forms";
import { EmpresaClienteDTO } from "src/app/models/EmpresaClienteDTO";
import { EmpresaClienteService } from "src/app/services/EmpresaCliente.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: "app-empresa-create",
  templateUrl: "./empresa-create.component.html",
  styleUrls: ["./empresa-create.component.css"],
})
export class EmpresaCreateComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  myControl = new FormControl();
  filteredOptions: Observable<EmpresaClienteDTO[]>;
  formCreate: FormGroup;
  empresa: EmpresaClienteDTO;
  empresas: EmpresaClienteDTO[];
  telefones: FormArray;
  enderecos: FormArray;
  UpdateOrDelete: boolean = false;
  Create: boolean = true;
  private formSubmitAttempt: boolean;

  get enderecoDTOsArray() {
    return (<FormArray>this.formCreate.get("enderecoDTOs")).controls;
  }

  get telefoneDTOsArray() {
    return (<FormArray>this.formCreate.get("telefoneDTOs")).controls;
  }

  private _filter(value: string): EmpresaClienteDTO[] {
    if(!value)
      return;

    const filterValue = value.toLowerCase();
    return this.empresas.filter(empresa => empresa.razaoSocial.toLowerCase().indexOf(filterValue) !== -1);
  }

  constructor(
    private empresaService: EmpresaClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.criaformCreate();
    this.getAllEmpresas();
    this.enderecos = <FormArray>this.formCreate.get("enderecoDTOs");
    this.telefones = <FormArray>this.formCreate.get("telefoneDTOs");
    console.log('udpareordelete', this.UpdateOrDelete);
  }

  autoCompleteEmpresa(): void {
    this.filteredOptions = this.formCreate.get('razaoSocial')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  criaFormGroupEndereco(): FormGroup {
    return this.fb.group({
      id: [null],
      pais_end: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      estado_end: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      cidade_end: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      bairro_end: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      rua_end: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      numero_end: [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
      cep_end: [null, Validators.compose([Validators.required, Validators.maxLength(8)])],
    });
  }

  criaFormGroupTelefone(): FormGroup {
    return this.fb.group({
      id: [null],
      ddd_tel: [null, Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern("^[0-9]*$")])],
      telefone_tel: [null, Validators.compose([Validators.required,Validators.maxLength(9), Validators.pattern("^[0-9]*$")])],
    });
  }

  criaformCreate() {
    this.formCreate = this.fb.group({
      id: [null],
      razaoSocial: ["", Validators.compose([Validators.required, Validators.maxLength(255)])],
      cnpj: ["", Validators.compose([Validators.required, Validators.maxLength(14), Validators.pattern("^[0-9]*$")])],
      inscricao_estadual: ["", Validators.compose([Validators.required, Validators.maxLength(14), Validators.pattern("^[0-9]*$")])],
      enderecoDTOs: this.fb.array([this.criaFormGroupEndereco()]),
      telefoneDTOs: this.fb.array([this.criaFormGroupTelefone()]),
    });
  }

  getAllEmpresas()
  {
    this.empresaService.getAllInfoEmpresaCliente().subscribe(
      (empresas: EmpresaClienteDTO[]) => {
        this.empresas = empresas;
        this.autoCompleteEmpresa();
        console.log(this.empresas);
      }
    );
  }

  createEmpresa(): void {
    this.empresa = this.formCreate.value;
    this.empresaService.postEmpresaCliente(this.empresa).subscribe(
      () => {
        this.empresaService.showMessage("Empresa criada com sucesso!");
        this.limparForm();
    });
  }

  deleteEmpresa(): void {
    this.empresa = this.formCreate.value;
    this.empresaService.deleteEmpresaCliente(this.empresa).subscribe(() => {
      this.empresaService.showMessage("Empresa deletada com sucesso!");
      this.limparForm();
    });
  }

  updateEmpresa(): void {
    this.empresa = this.formCreate.value;
    console.log(JSON.stringify(this.empresa));
    this.empresaService.putEmpresaCliente(this.empresa).subscribe(() => {
      this.empresaService.showMessage("Produto atualizado com sucesso!");
      this.limparForm();
    });
  }

  updateForm(modeloEmpresa: EmpresaClienteDTO): void {
    this.UpdateOrDelete = true;
    console.log(modeloEmpresa);
    this.formCreate.patchValue(modeloEmpresa);
  }

  limparForm(): void {
    this.formCreate.reset();
    this.getAllEmpresas();
    this.UpdateOrDelete = false;
  }

  addNovoEndereco() {
    this.enderecos.push(this.criaFormGroupEndereco());
    this.enderecos.updateValueAndValidity();
  }

  removeEndereco(index) {
    this.enderecos.removeAt(index);
  }

  addNovoTelefone() {
    this.telefones.push(this.criaFormGroupTelefone());
  }

  removeTelefone(index) {
    this.telefones.removeAt(index);
  }

  isFieldInvalid(field: string) {
    return (
      (!this.formCreate.get(field).valid &&
        this.formCreate.get(field).touched) ||
      (this.formCreate.get(field).untouched && this.formSubmitAttempt)
    );
  }

  isFieldArrayEndInvalid(index: any, field: string) {
    const formGroup = this.enderecos.controls[index] as FormGroup;
    return (
      (!formGroup.controls[field].valid && formGroup.controls[field].touched) ||
      (formGroup.controls[field].untouched && this.formSubmitAttempt)
    );
  }

  isFieldArrayTelInvalid(index: any, field: string) {
    const formGroup = this.telefones.controls[index] as FormGroup;
    return (
      (!formGroup.controls[field].valid && formGroup.controls[field].touched) ||
      (formGroup.controls[field].untouched && this.formSubmitAttempt)
    ) 

    
  }
  public hasError = (field: string, errorName: string) =>{
    return this.formCreate.controls[field].hasError(errorName);
  }

  public hasErrorArray = (index: any, field: string, errorName: string, telefone: boolean = false, endereco: boolean = false) =>{
   
    if(telefone){
      const formGroup = <FormGroup>this.telefones.controls[index];
      return formGroup.controls[field].hasError(errorName);
    }

    if(endereco){
      const formGroup = <FormGroup>this.enderecos.controls[index];
      return formGroup.controls[field].hasError(errorName);
    }
  }
}
