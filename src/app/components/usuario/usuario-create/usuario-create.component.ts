import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/Usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-create',
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.css']
})
export class UsuarioCreateComponent implements OnInit {

  formCreate: FormGroup;
  usuario: Usuario;
  private formSubmitAttempt: boolean;
  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.criaFormCreate();
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

  createUsuario(): void {
    this.usuario = this.formCreate.value;
    console.log(this.usuario);
    this.usuarioService.postUsuario(this.usuario).subscribe(
      () => {
        this.usuarioService.showMessage("Usuário criado com sucesso!");
        this.router.navigate(["/usuarios"]);
      });
  }

  cancelar() : void {
    this.router.navigate(["/usuarios"]);
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
