import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/components/template/header/header.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css']
})
export class RelatorioComponent implements OnInit {

  tabs: { icon: string, nameTab: string}[] = [
    {icon: 'business', nameTab: 'Empresas'},
    {icon: 'supervised_user_circle', nameTab: 'Funcionários'},
    {icon: 'account_circle', nameTab: 'Usuários'},
    {icon: 'portrait', nameTab: 'Perfil'},
    {icon: 'whatshot', nameTab: 'Equipamentos'}
  ];
  constructor(
    private router: Router,
    private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.HeaderData = {
      title: "Relatórios",
      icone: "bar_chart",
      routeUrl: "/relatorios",
    };
  }

}
