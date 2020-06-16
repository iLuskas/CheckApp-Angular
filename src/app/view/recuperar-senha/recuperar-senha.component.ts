import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UsuarioService } from "src/app/services/Usuario.service";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { AlterarSenhaUsuario } from 'src/app/models/modelsHelper/AlterarSenhaUsuario';

@Component({
  selector: "app-recuperar-senha",
  templateUrl: "./recuperar-senha.component.html",
  styleUrls: ["./recuperar-senha.component.css"],
})
export class RecuperarSenhaComponent implements OnInit {
  formRecuperaSenha: FormGroup; // {1}
  formAlteraSenha: FormGroup;
  private formSubmitAttempt: boolean; // {2}
  isLoading: boolean;
  token: string;
  EmailEnviado: boolean;
  alterouSenha: boolean;
  titulo: string = 'Recuperação de Senha'
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formRecuperaSenha = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
    });

    this.formAlteraSenha = this.fb.group(
      {
        email: [
          {value: '', disabled: true},
          Validators.compose([Validators.required, Validators.email]),
        ],
        senha: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ]),
        ],
        confirmSenha: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
          ]),
        ],
      },
      {
        validator: this.confirmSenhas("senha", "confirmSenha"),
      }
    );

    this.route.queryParams.subscribe((params) => {
      if (params.token) {
        this.token = params.token;
        this.titulo = "Nova Senha";
        this.formAlteraSenha.controls.email.patchValue(params.email);
      }
    });
  }

  onSubmit() {
    this.isLoading = !this.isLoading;
    const email = this.formRecuperaSenha.controls.email.value;
    this.usuarioService.RecuperarSenhaUsuario(email).subscribe((response) => {
      if(response){
        this.usuarioService.showMessage("E-mail Enviado com sucesso!");
        console.log(response);
        this.isLoading = !this.isLoading;
        this.EmailEnviado = !this.EmailEnviado;
      }
    },(error: HttpErrorResponse) =>{
      this.isLoading = !this.isLoading;
      this.usuarioService.erroHandler(error)
    });
  }

  onSubmitFormAlterarSenha() {
    this.isLoading = !this.isLoading;

    let modelo = {
      email: this.formAlteraSenha.controls.email.value,
      senha: this.formAlteraSenha.controls.senha.value
    }
    console.log("asdasdas",modelo)
    this.usuarioService.AlterarSenha(modelo, this.token).subscribe((response) => {
      if(response){
        this.usuarioService.showMessage("Senha alterada com sucesso!");
        this.isLoading = !this.isLoading;
        this.alterouSenha = !this.alterouSenha;
        this.titulo = "Senha alterada!";
      }
    },(error: HttpErrorResponse) =>{
      this.isLoading = !this.isLoading;
      this.usuarioService.erroHandler(error)
    });
  }

  confirmSenhas(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  isFieldInvalid(field: string, alteraSenhaLayout: boolean = false) {
    if(alteraSenhaLayout) {
      return (
        (!this.formAlteraSenha.get(field).valid &&
          this.formAlteraSenha.get(field).touched) ||
        (this.formAlteraSenha.get(field).untouched && this.formSubmitAttempt)
      );
    }

    return (
      (!this.formRecuperaSenha.get(field).valid &&
        this.formRecuperaSenha.get(field).touched) ||
      (this.formRecuperaSenha.get(field).untouched && this.formSubmitAttempt)
    );
  }

  public hasError = (field: string, errorName: string, alteraSenhaLayout: boolean = false) =>{
    if(alteraSenhaLayout){
      return this.formAlteraSenha.controls[field].hasError(errorName);
    }

    return this.formRecuperaSenha.controls[field].hasError(errorName);
  }
}
