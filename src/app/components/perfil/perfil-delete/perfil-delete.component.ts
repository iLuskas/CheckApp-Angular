import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PerfilDTO } from 'src/app/models/PerfilDTO';
import { PerfilService } from 'src/app/services/Perfil.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil-delete',
  templateUrl: './perfil-delete.component.html',
  styleUrls: ['./perfil-delete.component.css']
})
export class PerfilDeleteComponent implements OnInit {

  formDelete: FormGroup;
  perfil: PerfilDTO;
  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.criaFormDelete();
    this.getPerfilById();
  }

  criaFormDelete() {
    this.formDelete = this.fb.group({
      id: [null],
      funcao_perfil: [{value: null, disabled: true}]
    });
  }

  getPerfilById(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.perfilService.getPerfilById(id).subscribe(
      (perfil: PerfilDTO) => {
        
        this.formDelete.patchValue(perfil);
      }
    );
  }

  deletePerfil(): void {
    this.perfil = this.formDelete.value;
    
    this.perfilService.deletePerfil(this.perfil).subscribe(
      () => {
        this.perfilService.showMessage("Perfil deletado com sucesso!");
        this.router.navigate(["/perfils"]);
      });
  }

  cancelar() : void {
    this.router.navigate(["/perfils"]);
  }

}
