import { Component, OnInit, HostListener } from "@angular/core";
import { HeaderData } from "../header/header-data.model";
import { HeaderService } from "../header/header.service";
import { AuthService } from "src/app/auth/auth.service";
import { Observable } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { shareReplay, map } from "rxjs/operators";
import { async } from "rxjs/internal/scheduler/async";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isOpened: boolean = false;
  cacheUsuario: any;
  isMobile: boolean;
  isHandSet$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  navItens: any[] = [
    { link: "/home", icon: "home", nameMenu: "Início" },
    { link: "/agendamentos", icon: "event_note", nameMenu: "Agendamentos" },
    { link: "/empresas", icon: "business", nameMenu: "Empresas" },
    {
      link: "/funcionarios",
      icon: "supervised_user_circle",
      nameMenu: "Funcionários",
    },
    { link: "/usuarios", icon: "account_circle", nameMenu: "Usuários" },
    { link: "/perfil", icon: "portrait", nameMenu: "Perfil" },
    { link: "/equipamentos", icon: "whatshot", nameMenu: "Equipamentos" },
    { link: "/inspecoes", icon: "fact_check", nameMenu: "Inspeções" },
    { link: "/manutencoes", icon: "construction", nameMenu: "Manutenções" },
    { link: "/relatorios", icon: "bar_chart", nameMenu: "Relatórios" },
  ];

  navItensUser: any[] = [
    { link: "/home", icon: "home", nameMenu: "Início" },
    { link: "/inspecoes", icon: "fact_check", nameMenu: "Inspeções" },
    { link: "/manutencoes", icon: "construction", nameMenu: "Manutenções" },
    { link: "/equipamentos", icon: "whatshot", nameMenu: "Equipamentos" },
  ];

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService
  ) {
    this.isHandSet$.subscribe((result) => {
      this.isMobile = result;
    });
  }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.cacheUsuario = JSON.parse(localStorage.getItem("cacheUsuario"));
  }

  get title(): string {
    return this.headerService.HeaderData.title;
  }

  get icone(): string {
    return this.headerService.HeaderData.icone;
  }

  get routerUrl(): string {
    return this.headerService.HeaderData.routeUrl;
  }

  onLogout() {
    this.authService.logout();
  }

  sidebarOpen() {
    this.isOpened = !this.isOpened;
  }

  sidebarClose() {
    this.isOpened = !this.isOpened;
  }

  OnChoseMenu(menu: any) {
    if (this.isMobile) {
      menu.toggle();
    }
  }
}
