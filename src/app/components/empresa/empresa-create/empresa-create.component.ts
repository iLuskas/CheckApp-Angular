import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from "@angular/forms";
import { EmpresaClienteDTO } from "src/app/models/EmpresaClienteDTO";
import { EmpresaClienteService } from "src/app/services/EmpresaCliente.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "app-empresa-create",
  templateUrl: "./empresa-create.component.html",
  styleUrls: ["./empresa-create.component.css"],
})
export class EmpresaCreateComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  filteredOptions: Observable<EmpresaClienteDTO[]>;
  formCreate: FormGroup;
  empresa: EmpresaClienteDTO;
  empresas: EmpresaClienteDTO[];
  telefones: FormArray;
  enderecos: FormArray;
  UpdateOrDelete: boolean = false;
  Create: boolean = true;
  isLoading:  boolean;
  metodoApi: string = 'postEmpresaCliente';
  file: File;
  imgPreview: any;
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
    private fb: FormBuilder,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.criaformCreate();
    this.getAllEmpresas();
    this.enderecos = <FormArray>this.formCreate.get("enderecoDTOs");
    this.telefones = <FormArray>this.formCreate.get("telefoneDTOs");
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
      imagemUrl: [""],
      email: ["",Validators.compose([Validators.required, Validators.maxLength(50)])],
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
      }
    );
  }

  uploadImage() {
    if(this.file)
      this.empresaService.postUpload(this.file).subscribe();
  }

  getImagemFromBase64(any) {
    this.imgPreview = "data:image/png;base64,"+any;
  }

  salvarEmpresa(): void {
    this.isLoading = !this.isLoading;
    this.empresa = this.formCreate.value;
    this.uploadImage();
    this.empresaService[this.metodoApi](this.empresa).subscribe(
      () => {
        this.empresaService.showMessage(
          !this.UpdateOrDelete ?
          "Empresa criada com sucesso!" :
          "Empresa atualizada com sucesso!"
          );
        this.limparForm();
        this.isLoading = !this.isLoading;
    });
  }

  deleteEmpresa(): void {
    this.isLoading = !this.isLoading;
    this.empresa = this.formCreate.value;
    this.empresaService.deleteEmpresaCliente(this.empresa).subscribe(() => {
      this.empresaService.showMessage("Empresa deletada com sucesso!");
      this.limparForm();
      this.isLoading = !this.isLoading;
    });
  }

  updateForm(modeloEmpresa: EmpresaClienteDTO): void {
    this.UpdateOrDelete = true;
    this.imgPreview = '';
    this.metodoApi = 'putEmpresaCliente';
    this.empresa = Object.assign(modeloEmpresa);
    if(modeloEmpresa.imagemUrlBase64)
      this.getImagemFromBase64(modeloEmpresa.imagemUrlBase64);    
    
    this.formCreate.patchValue(this.empresa);
  }

  limparForm(): void {
    this.formCreate.reset();
    this.getAllEmpresas();
    this.UpdateOrDelete = false;
    this.metodoApi = 'postEmpresaCliente';
    this.imgPreview = '';
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

  onFileChange(event): void {
    const reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.imgPreview = reader.result; 
    }

    if(event.target.files && event.target.files.length)
    {
      this.file = event.target.files;
      this.formCreate.controls.imagemUrl.setValue(this.file[0].name);
    }
  }

  onSearchEmpChange(searchValue: string): void {
    if(!searchValue){
      this.limparForm();
    }
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
