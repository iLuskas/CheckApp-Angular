import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PerfilDTO } from 'src/app/models/PerfilDTO';
import { PerfilService } from 'src/app/services/Perfil.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-read-layout',
  templateUrl: './perfil-read-layout.component.html',
  styleUrls: ['./perfil-read-layout.component.css']
})
export class PerfilReadLayoutComponent implements OnInit {

  formRead: FormGroup;
  perfil: PerfilDTO;
  constructor(
    private perfilService: PerfilService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.criaFormRead();
    this.getPerfilById();
  }

  criaFormRead() {
    this.formRead = this.fb.group({
      id: [null],
      funcao_perfil: [{value: null, disabled: true}]
    });
  }

  getPerfilById(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.perfilService.getPerfilById(id).subscribe(
      (perfil: PerfilDTO) => {
        console.log(perfil);
        this.formRead.patchValue(perfil);
      }
    );
  }

  cancelar() : void {
    this.router.navigate(["/perfils"]);
  }

}
