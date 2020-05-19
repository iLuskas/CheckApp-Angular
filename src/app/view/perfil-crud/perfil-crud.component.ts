import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/components/template/header/header.service';

@Component({
  selector: 'app-perfil-crud',
  templateUrl: './perfil-crud.component.html',
  styleUrls: ['./perfil-crud.component.css']
})
export class PerfilCrudComponent implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.HeaderData = {
      title: "Cadastro de Perfil",
      icone: "portrait",
      routeUrl: "/perfils",
    };
  }

}
