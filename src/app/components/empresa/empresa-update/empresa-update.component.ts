import { Component, OnInit } from "@angular/core";
import { EmpresaClienteService } from "src/app/services/EmpresaCliente.service";
import { EmpresaClienteDTO } from "src/app/models/EmpresaClienteDTO";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "app-empresa-update",
  templateUrl: "./empresa-update.component.html",
  styleUrls: ["./empresa-update.component.css"],
})
export class EmpresaUpdateComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  formUpdate: FormGroup;
  empresa: EmpresaClienteDTO;
  telefones: FormArray;
  enderecos: FormArray;
  private formSubmitAttempt: boolean;

  get enderecoDTOsArray() {
    return (<FormArray>this.formUpdate.get("enderecoDTOs")).controls;
  }

  get telefoneDTOsArray() {
    return (<FormArray>this.formUpdate.get("telefoneDTOs")).controls;
  }

  constructor(
    private empresaService: EmpresaClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getempresaById();
    this.criaFormUpdate();

    this.enderecos = <FormArray>this.formUpdate.get("enderecoDTOs");
    this.telefones = <FormArray>this.formUpdate.get("telefoneDTOs");
  }

  criaFormGroupEndereco(): FormGroup {
    return this.fb.group({
      id: [null],
      pais_end: [null, Validators.compose([Validators.required])],
      estado_end: [null, Validators.compose([Validators.required])],
      cidade_end: [null, Validators.compose([Validators.required])],
      bairro_end: [null, Validators.compose([Validators.required])],
      rua_end: [null, Validators.compose([Validators.required])],
      numero_end: [null, Validators.compose([Validators.required])],
      cep_end: [null, Validators.compose([Validators.required])],
    });
  }

  criaFormGroupTelefone(): FormGroup {
    return this.fb.group({
      id: [null],
      ddd_tel: [null, Validators.compose([Validators.required])],
      telefone_tel: [null, Validators.compose([Validators.required])],
    });
  }

  criaFormUpdate() {
    this.formUpdate = this.fb.group({
      id: [null],
      razaoSocial: ["", Validators.required],
      cnpj: ["", Validators.required],
      inscricao_estadual: ["", Validators.required],
      enderecoDTOs: this.fb.array([this.criaFormGroupEndereco()]),
      telefoneDTOs: this.fb.array([this.criaFormGroupTelefone()]),
    });
  }

  getempresaById() {
    const id = this.route.snapshot.paramMap.get("id");
    this.empresaService
      .getEmpresaClienteById(id)
      .subscribe((empresa) => {        
        console.log(empresa);
        this.formUpdate.patchValue(empresa);
      });
  }

  updateEmpresa(): void {
    this.empresa = this.formUpdate.value;
    console.log(JSON.stringify(this.empresa));
    this.empresaService.putEmpresaCliente(this.empresa).subscribe(() => {
      this.empresaService.showMessage("Produto atualizado com sucesso!");
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
      (!this.formUpdate.get(field).valid &&
        this.formUpdate.get(field).touched) ||
      (this.formUpdate.get(field).untouched && this.formSubmitAttempt)
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
    return this.formUpdate.controls[field].hasError(errorName);
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
