import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { FuncionarioDTO } from 'src/app/models/FuncionarioDTO';
import { PerfilDTO } from 'src/app/models/PerfilDTO';
import { Usuario } from 'src/app/models/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { FuncionarioService } from 'src/app/services/Funcionario.service';
import { PerfilService } from 'src/app/services/Perfil.service';
import { UsuarioService } from 'src/app/services/Usuario.service';

@Component({
  selector: 'app-funcionario-read-layout',
  templateUrl: './funcionario-read-layout.component.html',
  styleUrls: ['./funcionario-read-layout.component.css']
})
export class FuncionarioReadLayoutComponent implements OnInit {
  panelEndOpenState = false;
  panelTelOpenState = false;
  formRead: FormGroup;
  funcionario: FuncionarioDTO;
  perfils: PerfilDTO[];
  perfil: PerfilDTO;
  usuarios: Usuario[];
  usuario: Usuario;
  formGroupReadPerfil: FormGroup;
  formGroupReadUsuario: FormGroup;
  telefones: FormArray;
  enderecos: FormArray;


  get enderecoDTOsArray() {
    return (<FormArray>this.formRead.get("enderecoDTOs")).controls;
  }

  get telefoneDTOsArray() {
    return (<FormArray>this.formRead.get("telefoneDTOs")).controls;
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
    this.criaformRead();
    this.criaFormGroupPerfil();
    this.criaFormGroupUsuario();
    this.getAllPerfils();
    this.getAllUsuarios();
    this.getFuncionarioById();
    this.enderecos = <FormArray>this.formRead.get("enderecoDTOs");
    this.telefones = <FormArray>this.formRead.get("telefoneDTOs");
  }

  criaFormGroupEndereco(): FormGroup {
    return this.fb.group({
      id: [null],
      pais_end: [{ value: null, disabled: true }],
      estado_end: [{ value: null, disabled: true }],
      cidade_end: [{ value: null, disabled: true }],
      bairro_end: [{ value: null, disabled: true }],
      rua_end: [{ value: null, disabled: true }],
      numero_end: [{ value: null, disabled: true }],
      cep_end: [{ value: null, disabled: true }],
    });
  }

  criaFormGroupTelefone(): FormGroup {
    return this.fb.group({
      id: [null],
      ddd_tel: [{ value: null, disabled: true }],
      telefone_tel: [{ value: null, disabled: true }],
    });
  }
  criaFormGroupPerfil(): void {
    this.formGroupReadPerfil = this.fb.group({
      id: [null],
      funcao_perfil: [{value: null, disabled: true}],
    });
  }

  criaFormGroupUsuario(): void {
    this.formGroupReadUsuario = this.fb.group({
      id: [null],
      login: [{value: null, disabled: true}],
      senha: [{value: null, disabled: true}],
    });
  }

  criaformRead() {
    this.formRead = this.fb.group({
      id: [null],
      perfilid: [null],
      usuarioid: [null],
      nome: [{ value: null, disabled: true }],
      cpf: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      enderecoDTOs: this.fb.array([this.criaFormGroupEndereco()]),
      telefoneDTOs: this.fb.array([this.criaFormGroupTelefone()]),
    });
  }


  getFuncionarioById() {
    const id = this.route.snapshot.paramMap.get("id");
    this.funcionarioService.getFuncionarioById(id).subscribe((funcionario) => {
      console.log(funcionario);
      this.formRead.patchValue(funcionario);
      this.getPerfilById(funcionario.perfilId);
      if (funcionario.usuarioId) this.getUsuarioById(funcionario.usuarioId);
    });
  }

  getAllPerfils() {
    this.perfilService.getAllPerfil().subscribe((perfils: PerfilDTO[]) => {
      this.perfils = perfils;
    });
  }

  perfilSelecionado(perfil: PerfilDTO): void {
    this.formGroupReadPerfil.patchValue(perfil);
    this.formRead.controls["perfilid"].patchValue(perfil.id);
  }

  getPerfilById(id: number) {
    this.perfil = this.perfils.find((perfil) => perfil.id === id);
    console.log(this.perfil);
  }

  getAllUsuarios(): void {
    this.usuarioService.getAllUsuario().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      console.log(this.usuarios);
    });
  }

  getUsuarioById(id: number) {
    this.usuario = this.usuarios.find((usuario) => usuario.id === id);
    console.log(this.usuario);
  }

  usuarioSelecionado(usuario: Usuario): void {
    this.formGroupReadUsuario.patchValue(usuario);
    this.formRead.controls["usuarioid"].patchValue(usuario.id);
    console.log(this.formRead.value);
  }

  cancelar(): void {
    this.router.navigate(["/funcionarios"]);
  }
}
