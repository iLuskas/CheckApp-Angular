import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerfilDTO } from 'src/app/models/PerfilDTO';
import { PerfilService } from 'src/app/services/Perfil.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-update',
  templateUrl: './perfil-update.component.html',
  styleUrls: ['./perfil-update.component.css']
})
export class PerfilUpdateComponent implements OnInit {
  formUpdate: FormGroup;
  perfil: PerfilDTO;
  private formSubmitAttempt: boolean;
  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.criaFormUpdate();
    this.getPerfilById();
  }

  criaFormUpdate() {
    this.formUpdate = this.fb.group({
      id: [null],
      funcao_perfil: ["", Validators.compose([Validators.required, Validators.maxLength(50)])]
    });
  }

  getPerfilById(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.perfilService.getPerfilById(id).subscribe(
      (perfil: PerfilDTO) => {
        console.log(perfil);
        this.formUpdate.patchValue(perfil);
      }
    );
  }

  updatePerfil(): void {
    this.perfil = this.formUpdate.value;
    console.log(this.perfil);
    this.perfilService.putPerfil(this.perfil).subscribe(
      () => {
        this.perfilService.showMessage("Perfil editado com sucesso!");
        this.router.navigate(["/perfils"]);
      });
  }

  cancelar() : void {
    this.router.navigate(["/perfils"]);
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
