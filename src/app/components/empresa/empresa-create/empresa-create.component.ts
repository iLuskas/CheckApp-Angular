import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { EmpresaClienteDTO } from "src/app/models/EmpresaClienteDTO";
import { EmpresaClienteService } from "src/app/services/EmpresaCliente.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-empresa-create",
  templateUrl: "./empresa-create.component.html",
  styleUrls: ["./empresa-create.component.css"],
})
export class EmpresaCreateComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  formCreate: FormGroup;
  empresa: EmpresaClienteDTO;
  telefones: FormArray;
  enderecos: FormArray;
  private formSubmitAttempt: boolean;

  get enderecoDTOsArray() {
    return (<FormArray>this.formCreate.get("enderecoDTOs")).controls;
  }

  get telefoneDTOsArray() {
    return (<FormArray>this.formCreate.get("telefoneDTOs")).controls;
  }

  constructor(
    private empresaService: EmpresaClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.criaformCreate();

    this.enderecos = <FormArray>this.formCreate.get("enderecoDTOs");
    this.telefones = <FormArray>this.formCreate.get("telefoneDTOs");
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

  createEmpresa(): void {
    this.empresa = this.formCreate.value;
    this.empresaService.postEmpresaCliente(this.empresa).subscribe(
      () => {
        this.empresaService.showMessage("Empresa criada com sucesso!");
        this.router.navigate(["/empresas"]);
    });
  }

  cancelar(): void {
    this.router.navigate(["/empresas"]);
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
