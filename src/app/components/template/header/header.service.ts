import { Injectable } from '@angular/core';
import { HeaderData } from './header-data.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private openedMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private headerData = new BehaviorSubject<HeaderData>({
    title: 'Início',
    icone: 'home',
    routeUrl: '/home'
  });

  constructor() { }

  get GetOpenedMenu() {
    return this.openedMenu.asObservable();
  }

  get HeaderData(): HeaderData {
    return this.headerData.value;
  }

  set HeaderData(headerData: HeaderData) {
    this.headerData.next(headerData);
  }

  OpenedMenu(value: boolean) {
    return this.openedMenu.next(value);
  }
}
