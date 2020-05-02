import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { HeaderService } from "src/app/components/template/header/header.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-empresa-crud",
  templateUrl: "./empresa-crud.component.html",
  styleUrls: ["./empresa-crud.component.css"],
})
export class EmpresaCrudComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private cdref: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.headerService.HeaderData = {
      title: "Cadastro de Empresas",
      icone: "business",
      routeUrl: "/empresas",
    };
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

  navigateToCreate() {
    this.router.navigate(['/empresas/create']);
  }
}
