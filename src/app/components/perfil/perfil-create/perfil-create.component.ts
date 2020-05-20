import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { PerfilDTO } from "src/app/models/PerfilDTO";
import { PerfilService } from "src/app/services/Perfil.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "app-perfil-create",
  templateUrl: "./perfil-create.component.html",
  styleUrls: ["./perfil-create.component.css"],
})
export class PerfilCreateComponent implements OnInit {
  formCreate: FormGroup;
  perfil: PerfilDTO;
  perfils: PerfilDTO[];
  private formSubmitAttempt: boolean;
  UpdateOrDelete: boolean = false;
  filteredOptions: Observable<PerfilDTO[]>;

  private _filter(value: string): PerfilDTO[] {
    if (!value) return;

    const filterValue = value.toLowerCase();
    return this.perfils.filter(
      (perfil) => perfil.funcao_perfil.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.criaFormCreate();
    this.getAllPerfils();
  }

  autoCompletePerfil(): void {
    this.filteredOptions = this.formCreate
      .get("funcao_perfil")!
      .valueChanges.pipe(
        startWith(""),
        map((value) => this._filter(value))
      );
  }

  criaFormCreate() {
    this.formCreate = this.fb.group({
      id: [null],
      funcao_perfil: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
    });
  }

  getAllPerfils() {
    this.perfilService.getAllPerfil().subscribe((perfils: PerfilDTO[]) => {
      this.perfils = perfils;
      this.autoCompletePerfil();
      console.log(this.perfils);
    });
  }

  createPerfil(): void {
    this.perfil = this.formCreate.value;
    console.log(this.perfil);
    this.perfilService.postPerfil(this.perfil).subscribe(() => {
      this.perfilService.showMessage("Perfil criado com sucesso!");
    });
  }

  updatePerfil(): void {
    this.perfil = this.formCreate.value;
    console.log(this.perfil);
    this.perfilService.putPerfil(this.perfil).subscribe(() => {
      this.perfilService.showMessage("Perfil editado com sucesso!");
      this.router.navigate(["/perfils"]);
    });
  }

  deletePerfil(): void {
    this.perfil = this.formCreate.value;
    console.log(this.perfil);
    this.perfilService.deletePerfil(this.perfil).subscribe(() => {
      this.perfilService.showMessage("Perfil removido com sucesso!");
    });
  }

  updateForm(modeloPerfil: PerfilDTO): void {
    this.UpdateOrDelete = true;
    console.log(modeloPerfil);
    this.formCreate.patchValue(modeloPerfil);
  }

  limparForm(): void {
    this.getAllPerfils();
    this.formCreate.reset();
    this.perfil = null;
    this.UpdateOrDelete = false;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.formCreate.get(field).valid &&
        this.formCreate.get(field).touched) ||
      (this.formCreate.get(field).untouched && this.formSubmitAttempt)
    );
  }

  public hasError = (field: string, errorName: string) => {
    return this.formCreate.controls[field].hasError(errorName);
  };
}
