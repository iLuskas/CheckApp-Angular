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
    {link: '/home', icon: 'home', nameItem: 'Início'},
    {link: '/empresas', icon: 'business', nameItem: 'Empresas'},
    {link: '/usuarios', icon: 'account_circle', nameItem: 'Usuários'},
    {link: '/perfils', icon: 'portrait', nameItem: 'Perfils'},
    {link: '/equipamentos', icon: 'whatshot', nameItem: 'Equipamentos'},
    {link: '/relatorios', icon: 'bar_chart', nameItem: 'Relatórios'}
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
