import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerfilDTO } from 'src/app/models/PerfilDTO';
import { PerfilService } from 'src/app/services/Perfil.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-create',
  templateUrl: './perfil-create.component.html',
  styleUrls: ['./perfil-create.component.css']
})
export class PerfilCreateComponent implements OnInit {

  formCreate: FormGroup;
  perfil: PerfilDTO;
  private formSubmitAttempt: boolean;
  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.criaFormCreate();
  }

  criaFormCreate() {
    this.formCreate = this.fb.group({
      id: [null],
      funcao_perfil: ["", Validators.compose([Validators.required, Validators.maxLength(50)])]
    });
  }

  createPerfil(): void {
    this.perfil = this.formCreate.value;
    console.log(this.perfil);
    this.perfilService.postPerfil(this.perfil).subscribe(
      () => {
        this.perfilService.showMessage("Perfil criado com sucesso!");
        this.router.navigate(["/perfils"]);
      });
  }

  cancelar() : void {
    this.router.navigate(["/perfils"]);
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
