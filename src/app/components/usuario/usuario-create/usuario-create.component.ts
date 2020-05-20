import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/Usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-usuario-create',
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.css']
})
export class UsuarioCreateComponent implements OnInit {

  formCreate: FormGroup;
  usuario: Usuario;
  usuarios: Usuario[];
  private formSubmitAttempt: boolean;
  UpdateOrDelete: boolean = false;
  filteredOptions: Observable<Usuario[]>;
  lblSenha : string = "Senha";
  
  private _filter(value: string): Usuario[] {
    if(!value)
      return;

    const filterValue = value.toLowerCase();
    return this.usuarios.filter(func => func.login.toLowerCase().indexOf(filterValue) !== -1);
  }

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.criaFormCreate();
    this.getAllUsuarios();
  }

  autoCompleteUsuario(): void {
    this.filteredOptions = this.formCreate.get('login')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  criaFormCreate() {
    this.formCreate = this.fb.group({
      id: [null],
      login: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      senha: ["", Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30)])],
      confirmSenha: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])]
    }, {
        validator: this.confirmSenhas('senha', 'confirmSenha')
    });
  }

  getAllUsuarios() 
  {
    this.usuarioService.getAllUsuario().subscribe(
      (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.autoCompleteUsuario();
        console.log(this.usuarios);
      }
    );
  }

  createUsuario(): void {
    this.usuario = this.formCreate.value;
    console.log('USUARIO',this.usuario);
    this.usuarioService.postUsuario(this.usuario).subscribe(
      () => {
        this.usuarioService.showMessage("Usuário criado com sucesso!");
        this.limparForm();
      });
  }

  deleteUsuario(): void {
    this.usuario = this.formCreate.value;
    console.log(this.usuario);
    this.usuarioService.deleteUsuario(this.usuario).subscribe(
      () => {
        this.usuarioService.showMessage("Usuário removido com sucesso!");
        this.limparForm();
      });
  }

  updateUsuario(): void {
    this.usuario = this.formCreate.value;
    console.log(this.usuario);
    this.usuarioService.putUsuario(this.usuario).subscribe(
      () => {
        this.usuarioService.showMessage("Usuário alterado com sucesso!");
        this.limparForm();
      });
  }

  updateForm(modeloUsuario: Usuario): void {
    this.lblSenha = "Senha Atual"; 
    this.UpdateOrDelete = true;
    console.log(modeloUsuario);
    this.formCreate.patchValue(modeloUsuario);
  }

  limparForm(): void {
    this.getAllUsuarios();
    this.formCreate.reset();
    this.usuario = null;
    this.UpdateOrDelete = false;
    this.lblSenha = "Senha"; 
  }

  confirmSenhas(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
  }
  isFieldInvalid(field: string) {
    return (
      (!this.formCreate.get(field).valid &&
        this.formCreate.get(field).touched) ||
      (this.formCreate.get(field).untouched && this.formSubmitAttempt)
    );
  }

  public hasError = (field: string, errorName: string) =>{
    return this.formCreate.controls[field].hasError(errorName);
  }
}
