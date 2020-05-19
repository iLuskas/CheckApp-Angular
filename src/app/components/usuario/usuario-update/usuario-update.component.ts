import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/Usuario.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario-update',
  templateUrl: './usuario-update.component.html',
  styleUrls: ['./usuario-update.component.css']
})
export class UsuarioUpdateComponent implements OnInit {

  formUpdate: FormGroup;
  usuario: Usuario;
  private formSubmitAttempt: boolean;
  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.criaFormUpdate();
    this.getUsuarioById();
  }

  criaFormUpdate() {
    this.formUpdate = this.fb.group({
      id: [null],
      login: ["", Validators.compose([Validators.required, Validators.maxLength(50)])],
      senha: ["", Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30)])],
      confirmSenha: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])]
    }, {
        validator: this.confirmSenhas('senha', 'confirmSenha')
    });
  }

  updateUsuario(): void {
    this.usuario = this.formUpdate.value;
    console.log(this.usuario);
    this.usuarioService.putUsuario(this.usuario).subscribe(
      () => {
        this.usuarioService.showMessage("Usuário alterado com sucesso!");
        this.router.navigate(["/usuarios"]);
      });
  }

  getUsuarioById(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.usuarioService.getUsuarioById(id).subscribe(
      (perfil: Usuario) => {
        console.log(perfil);
        this.formUpdate.patchValue(perfil);
      }
    );
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
      (!this.formUpdate.get(field).valid &&
        this.formUpdate.get(field).touched) ||
      (this.formUpdate.get(field).untouched && this.formSubmitAttempt)
    );
  }

  public hasError = (field: string, errorName: string) =>{
    return this.formUpdate.controls[field].hasError(errorName);
  }
}
