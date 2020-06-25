import { Component, OnInit } from "@angular/core";
import { FuncionarioDTO } from "src/app/models/FuncionarioDTO";
import { FormGroup, FormArray, Validators, FormBuilder, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { FuncionarioService } from "src/app/services/Funcionario.service";
import { PerfilDTO } from "src/app/models/PerfilDTO";
import { PerfilService } from "src/app/services/Perfil.service";
import { Usuario } from "src/app/models/Usuario";
import { UsuarioService } from "src/app/services/Usuario.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: "app-funcionario-create",
  templateUrl: "./funcionario-create.component.html",
  styleUrls: ["./funcionario-create.component.css"],
})
export class FuncionarioCreateComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  formCreate: FormGroup;
  funcionario: FuncionarioDTO;
  funcionarios: FuncionarioDTO[];
  perfils: PerfilDTO[];
  usuarios: Usuario[];
  perfil: PerfilDTO;
  usuario: Usuario;
  formGroupCreatePerfil: FormGroup;
  formGroupcreateUsuario: FormGroup;
  telefones: FormArray;
  enderecos: FormArray;
  UpdateOrDelete: boolean = false;
  filteredOptions: Observable<FuncionarioDTO[]>;
  isLoading: boolean;
  metodoApi: string = 'postFuncionario';
  private formSubmitAttempt: boolean;

  get enderecoDTOsArray() {
    return (<FormArray>this.formCreate.get("enderecoDTOs")).controls;
  }

  get telefoneDTOsArray() {
    return (<FormArray>this.formCreate.get("telefoneDTOs")).controls;
  }

  private _filter(value: string): FuncionarioDTO[] {
    if(!value)
      return;

    const filterValue = value.toLowerCase();
    return this.funcionarios.filter(func => func.nome.toLowerCase().indexOf(filterValue) !== -1);
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private funcionarioService: FuncionarioService,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.criaformCreate();
    this.criaFormGroupPerfil();
    this.criaFormGroupUsuario();
    this.getAllFuncionarios();
    this.getAllPerfils();
    this.getAllUsuarios();
    this.enderecos = <FormArray>this.formCreate.get("enderecoDTOs");
    this.telefones = <FormArray>this.formCreate.get("telefoneDTOs");
  }

  autoCompleteFuncionario(): void {
    this.filteredOptions = this.formCreate.get('nome')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  criaFormGroupEndereco(): FormGroup {
    return this.fb.group({
      id: [null],
      pais_end: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      estado_end: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      cidade_end: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      bairro_end: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      rua_end: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      numero_end: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      cep_end: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(8)]),
      ],
    });
  }

  criaFormGroupTelefone(): FormGroup {
    return this.fb.group({
      id: [null],
      ddd_tel: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      telefone_tel: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(9),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
    });
  }

  criaFormGroupPerfil(): void {
    this.formGroupCreatePerfil = this.fb.group({
      id: [null, Validators.compose([Validators.required])],
      funcao_perfil: ["", Validators.compose([Validators.required])],
    });
  }

  criaFormGroupUsuario(): void {
    this.formGroupcreateUsuario = this.fb.group({
      id: [null],
      login: new FormControl(""),
      senha: [""],
    });
  }

  criaformCreate() {
    this.formCreate = this.fb.group({
      id: [null],
      perfilid: [null],
      usuarioid: [null],
      nome: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      cpf: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.email,
        ]),
      ],
      enderecoDTOs: this.fb.array([this.criaFormGroupEndereco()]),
      telefoneDTOs: this.fb.array([this.criaFormGroupTelefone()]),
    });
  }

  getAllFuncionarios(): void {
    this.funcionarioService
      .getAllInfoFuncionario()
      .subscribe(
        (funcionarios: FuncionarioDTO[]) => {
          this.funcionarios = funcionarios;
          this.autoCompleteFuncionario();
          console.log('FUNCIONARIOS',this.funcionarios);
      });
  }

  salvarFuncionario(stepper: any): void {
    this.isLoading = !this.isLoading;
    this.funcionario = this.formCreate.value;
    console.log(this.funcionario);
    this.funcionarioService[this.metodoApi](this.funcionario).subscribe(() => {
      this.funcionarioService.showMessage(
        !this.UpdateOrDelete ?
        "Funcionário criado com sucesso!" :
        "Funcionário alterado com sucesso"
        );
      this.limparForm(stepper);
      this.isLoading = !this.isLoading;
    });
  }

  updateFuncionario(stepper: any): void {
    this.isLoading = !this.isLoading;
    this.funcionario = this.formCreate.value;
    this.funcionarioService.putFuncionario(this.funcionario).subscribe(() => {
      this.funcionarioService.showMessage("Funcionário alterado com sucesso!");
      this.limparForm(stepper);
      this.isLoading = !this.isLoading;
    });
  }

  deleteFuncionario(stepper: any): void {
    this.isLoading = !this.isLoading;
    this.funcionario = this.formCreate.value;
    console.log(this.funcionario);
    this.funcionarioService.deleteFuncionario(this.funcionario).subscribe(() => {
      this.funcionarioService.showMessage("Funcionário removido com sucesso!");
      this.limparForm(stepper);
      this.isLoading = !this.isLoading;
    });
  }

  getAllPerfils() {
    this.perfilService.getAllPerfil().subscribe((perfils: PerfilDTO[]) => {
      this.perfils = perfils;
      console.log('PERFILS', this.perfils)
    });
  }

  getPerfilById(id: number) {
    this.perfil = this.perfils.find(perfil => perfil.id === id);
    this.perfilSelecionado(this.perfil);
    console.log('PERFILBYID',this.perfil)
  }

  perfilSelecionado(perfil: PerfilDTO): void {
    this.formGroupCreatePerfil.patchValue(perfil);
    this.formCreate.controls["perfilid"].patchValue(perfil.id);
    console.log('formcreateAfterperfil',this.formCreate.value);
  }

  getAllUsuarios(): void {
    this.usuarioService.getAllUsuario().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      console.log(this.usuarios);
    });
  }

  getUsuarioById(id: number) {
    this.usuario = this.usuarios.find(usuario => usuario.id === id);
    this.usuarioSelecionado(this.usuario);
  }

  usuarioSelecionado(usuario: Usuario): void {
    this.formGroupcreateUsuario.patchValue(usuario)
    this.formCreate.controls["usuarioid"].patchValue(usuario.id);
    console.log('formcreateAfterusuario',this.formCreate.value);
  }

  updateForm(modeloFuncionario: FuncionarioDTO): void {
    this.UpdateOrDelete = true;
    this.metodoApi = 'putFuncionario';
    console.log(modeloFuncionario);
    this.formCreate.patchValue(modeloFuncionario);
    this.getPerfilById(modeloFuncionario.perfilId);

    if(modeloFuncionario.usuarioId)
      this.getUsuarioById(modeloFuncionario.usuarioId);
  }

  limparForm(stepper:any = null): void {
    if(stepper)
      stepper.reset();

    this.formCreate.reset();
    this.formGroupCreatePerfil.reset();
    this.perfil = null;
    this.formGroupcreateUsuario.reset();
    this.usuario = null;
    this.getAllFuncionarios();
    this.getAllPerfils();
    this.getAllUsuarios();
    this.UpdateOrDelete = false;
    this.metodoApi = 'postFuncionario';
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
    );
  }
  public hasError = (field: string, errorName: string) => {
    return this.formCreate.controls[field].hasError(errorName);
  };

  public hasErrorArray = (
    index: any,
    field: string,
    errorName: string,
    telefone: boolean = false,
    endereco: boolean = false
  ) => {
    if (telefone) {
      const formGroup = <FormGroup>this.telefones.controls[index];
      return formGroup.controls[field].hasError(errorName);
    }

    if (endereco) {
      const formGroup = <FormGroup>this.enderecos.controls[index];
      return formGroup.controls[field].hasError(errorName);
    }
  };
}
