import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/Usuario.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario-delete',
  templateUrl: './usuario-delete.component.html',
  styleUrls: ['./usuario-delete.component.css']
})
export class UsuarioDeleteComponent implements OnInit {

  formDelete: FormGroup;
  usuario: Usuario;
  private formSubmitAttempt: boolean;
  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.criaFormDelete();
    this.getUsuarioById();
  }

  criaFormDelete() {
    this.formDelete = this.fb.group({
      id: [null],
      login: [{value: null, disabled: true}],
      senha: [{value: null, disabled: true}]
    }, {
        validator: this.confirmSenhas('senha', 'confirmSenha')
    });
  }

  deleteUsuario(): void {
    this.usuario = this.formDelete.value;
    
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
        
        this.formDelete.patchValue(perfil);
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
      (!this.formDelete.get(field).valid &&
        this.formDelete.get(field).touched) ||
      (this.formDelete.get(field).untouched && this.formSubmitAttempt)
    );
  }

  public hasError = (field: string, errorName: string) =>{
    return this.formDelete.controls[field].hasError(errorName);
  }

}
