import { Component, OnInit } from "@angular/core";
import { HeaderService } from "./header.service";
import { AuthService } from "src/app/auth/auth.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  constructor(
    private headerService: HeaderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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
}
