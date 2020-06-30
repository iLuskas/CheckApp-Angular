import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public token: string;
  
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router
  ) {
    // const cacheUsuario = JSON.parse(localStorage.getItem('cacheUsuario'));
    // this.token = cacheUsuario && cacheUsuario.token;
  }

  login(user: Usuario) {
    if (user) {
      this.loggedIn.next(true);      
      this.router.navigate(['home']);
    }
  }

  logout() {
    this.loggedIn.next(false);
    this.router.navigate(['login']);
    localStorage.removeItem('cacheUsuario');
    localStorage.removeItem('AgendaSeleted');
  }
}