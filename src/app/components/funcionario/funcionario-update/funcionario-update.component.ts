import { Component, OnInit } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { FuncionarioDTO } from "src/app/models/FuncionarioDTO";
import { PerfilDTO } from "src/app/models/PerfilDTO";
import { Usuario } from "src/app/models/Usuario";
import { Router, ActivatedRoute } from "@angular/router";
import { FuncionarioService } from "src/app/services/Funcionario.service";
import { PerfilService } from "src/app/services/Perfil.service";
import { UsuarioService } from "src/app/services/Usuario.service";
import { EMPTY } from 'rxjs';

@Component({
  selector: "app-funcionario-update",
  templateUrl: "./funcionario-update.component.html",
  styleUrls: ["./funcionario-update.component.css"],
})
export class FuncionarioUpdateComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  formUpdate: FormGroup;
  funcionario: FuncionarioDTO;
  perfils: PerfilDTO[];
  perfil: PerfilDTO;
  usuarios: Usuario[];
  usuario: Usuario;
  formGroupUpdatePerfil: FormGroup;
  formGroupUpdateUsuario: FormGroup;
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
    private fb: FormBuilder,
    private router: Router,
    private funcionarioService: FuncionarioService,
    private perfilService: PerfilService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.criaformUpdate();
    this.criaFormGroupPerfil();
    this.criaFormGroupUsuario();
    this.getAllPerfils();
    this.getAllUsuarios();
    this.getFuncionarioById();
    this.enderecos = <FormArray>this.formUpdate.get("enderecoDTOs");
    this.telefones = <FormArray>this.formUpdate.get("telefoneDTOs");
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
    this.formGroupUpdatePerfil = this.fb.group({
      id: [null, Validators.compose([Validators.required])],
      funcao_perfil: ["", Validators.compose([Validators.required])],
    });
  }

  criaFormGroupUsuario(): void {
    this.formGroupUpdateUsuario = this.fb.group({
      id: [null],
      login: [""],
      senha: [""],
    });
  }

  criaformUpdate() {
    this.formUpdate = this.fb.group({
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

  updateFuncionario(): void {
    this.funcionario = this.formUpdate.value;
    
    this.funcionarioService.putFuncionario(this.funcionario).subscribe(() => {
      this.funcionarioService.showMessage("Funcionário alterado com sucesso!");
      this.router.navigate(["/funcionarios"]);
    });
  }

  getFuncionarioById() {
    const id = this.route.snapshot.paramMap.get("id");
    this.funcionarioService
      .getFuncionarioById(id)
      .subscribe((funcionario) => {        
        
        this.formUpdate.patchValue(funcionario);
        this.getPerfilById(funcionario.perfilId);
        if(funcionario.usuarioId)
          this.getUsuarioById(funcionario.usuarioId);
      });
  }

  getAllPerfils() {
    this.perfilService.getAllPerfil().subscribe((perfils: PerfilDTO[]) => {
      this.perfils = perfils;
    });
  }

  perfilSelecionado(perfil: PerfilDTO): void {
    this.formGroupUpdatePerfil.patchValue(perfil);
    this.formUpdate.controls["perfilid"].patchValue(perfil.id);
  }

  getPerfilById(id: number) {
    this.perfil = this.perfils.find(perfil => perfil.id === id);
    
  }

  getAllUsuarios(): void {
    this.usuarioService.getAllUsuario().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      
    });
  }

  getUsuarioById(id: number) {
    this.usuario = this.usuarios.find(usuario => usuario.id === id);
    
  }

  usuarioSelecionado(usuario: Usuario): void {
    this.formGroupUpdateUsuario.patchValue(usuario);
    this.formUpdate.controls["usuarioid"].patchValue(usuario.id);
    
  }

  cancelar(): void {
    this.router.navigate(["/funcionarios"]);
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
    );
  }
  public hasError = (field: string, errorName: string) => {
    return this.formUpdate.controls[field].hasError(errorName);
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
