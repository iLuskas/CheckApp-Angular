import { Component, OnInit } from "@angular/core";
import { HeaderService } from "src/app/components/template/header/header.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/auth/auth.service";
import { Usuario } from "src/app/models/Usuario";
import { UsuarioService } from "src/app/services/Usuario.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup; // {1}
  private formSubmitAttempt: boolean; // {2}
  isLoading: boolean;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.formLogin = this.fb.group({
      login: ["", Validators.required],
      senha: ["", Validators.required],
      perfil: [""]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.formLogin.get(field).valid && this.formLogin.get(field).touched) ||
      (this.formLogin.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit() {
    this.isLoading = !this.isLoading;

    const usuario = new Usuario();

    usuario.login = this.formLogin.controls.login.value;
    usuario.senha = this.formLogin.controls.senha.value;
    if (this.formLogin.valid) {
      this.usuarioService.Login(usuario).subscribe(
        (userAuth: Usuario) => {
          console.log(userAuth);
          if (userAuth) {
            localStorage.setItem("cacheUsuario", JSON.stringify(userAuth));
            this.authService.login(userAuth);
            this.isLoading = !this.isLoading;
          } else {
            this.usuarioService.showMessage("Usuário não foi encontrato. Favor verifique suas credencias.", true);
            this.isLoading = !this.isLoading;
          }
        },
        (error) => {
          console.log(error);
          this.isLoading = !this.isLoading;
        }
      );
    }
    this.formSubmitAttempt = true; 
  }
}
