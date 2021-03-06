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
  isLoading: boolean;
  metodoApi: string = 'postPerfil';
  private _filter(value: string): PerfilDTO[] {
    if (!value) return;

    const filterValue = value.toLowerCase();
    return this.perfils.filter(
      (perfil) => perfil.funcao_perfil.toLowerCase().indexOf(filterValue) !== -1
    );
  }

  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder
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
      
    });
  }

  createPerfil(): void {
    this.isLoading = !this.isLoading;
    this.perfil = this.formCreate.value;
    
    this.perfilService[this.metodoApi](this.perfil).subscribe(() => {
      this.perfilService.showMessage(
        !this.UpdateOrDelete ?
        "Perfil criado com sucesso!" :
        "Perfil alterado com sucesso!"
        );
      this.isLoading = !this.isLoading;
      this.limparForm();
      this.getAllPerfils();
    });
  }

  updatePerfil(): void {
    this.isLoading = !this.isLoading;
    this.perfil = this.formCreate.value;
    
    this.perfilService.putPerfil(this.perfil).subscribe(() => {
      this.perfilService.showMessage("Perfil editado com sucesso!");
      this.isLoading = !this.isLoading;
      this.limparForm();
      this.getAllPerfils();
    });
  }

  deletePerfil(): void {
    this.isLoading = !this.isLoading;
    this.perfil = this.formCreate.value;
    
    this.perfilService.deletePerfil(this.perfil).subscribe(() => {
      this.perfilService.showMessage("Perfil removido com sucesso!");
      this.isLoading = !this.isLoading;
      this.limparForm();
      this.getAllPerfils();
    });
  }

  updateForm(modeloPerfil: PerfilDTO): void {
    this.UpdateOrDelete = true;
    this.metodoApi = 'putPerfil'
    
    this.formCreate.patchValue(modeloPerfil);
  }

  limparForm(): void {
    this.getAllPerfils();
    this.formCreate.reset();
    this.perfil = null;
    this.UpdateOrDelete = false;
    this.metodoApi = 'postPerfil';
  }

  onSearchChange(searchValue: string): void { 
    if(!searchValue) 
      this.limparForm();
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
