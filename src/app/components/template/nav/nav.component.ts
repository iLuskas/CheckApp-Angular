import { Component, OnInit } from '@angular/core';
import { HeaderData } from '../header/header-data.model';
import { HeaderService } from '../header/header.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { shareReplay, map } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isOpened: boolean = false;        
  isHandSet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
  navItens: any[] = [
    {link: '/home', icon: 'home', nameMenu: 'Início'},
    {link: '/empresas', icon: 'business', nameMenu: 'Empresas'},
    {link: '/funcionarios', icon: 'supervised_user_circle', nameMenu: 'Funcionários'},
    {link: '/usuarios', icon: 'account_circle', nameMenu: 'Usuários'/*, subMenus: [
      {subMenulink:'/funcionarios', subMenuicon: 'supervised_user_circle', subMenuName: 'Funcionários'},
      {subMenulink:'/usuarios', subMenuicon: 'account_circle', subMenuName: 'Usuários'},
      {subMenulink: '/perfils', subMenuicon: 'portrait', subMenuName: 'Perfils'}
    ]*/},
    {link: '/perfils', icon: 'portrait', nameMenu: 'Perfils'},
    {link: '/equipamentos', icon: 'whatshot', nameMenu: 'Equipamentos'},
    {link: '/relatorios', icon: 'bar_chart', nameMenu: 'Relatórios'}
  ];

  constructor(private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn; 
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

  onLogout(){
    this.authService.logout();                      
  }

  sidebarOpen() {
    this.isOpened = !this.isOpened;
  }

  sidebarClose() {
    this.isOpened = !this.isOpened;
  }

}
