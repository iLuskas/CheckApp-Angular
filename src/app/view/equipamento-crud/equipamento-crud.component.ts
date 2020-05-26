import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/components/template/header/header.service';

@Component({
  selector: 'app-equipamento-crud',
  templateUrl: './equipamento-crud.component.html',
  styleUrls: ['./equipamento-crud.component.css']
})
export class EquipamentoCrudComponent implements OnInit {

  constructor(
    private headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.HeaderData = {
      title: "Cadastro de Equipamentos",
      icone: "whatshot",
      routeUrl: "/equipamentos",
    };
  }

}
