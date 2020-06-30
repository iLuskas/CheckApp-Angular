import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AgendamentoService } from "src/app/services/agendamento.service";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { HeaderService } from '../template/header/header.service';

@Component({
  selector: "app-inspecao",
  templateUrl: "./inspecao.component.html",
  styleUrls: ["./inspecao.component.css"],
})
export class InspecaoComponent implements OnInit, AfterViewInit {
  cacheUsuario: any;
  agendamentos: any[];
  qtdEquipNotInsp: any[];
  qtdEquipInsp: any[];
  constructor(
    private agendamentoService: AgendamentoService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {}

  ngAfterViewInit(): void {
    this.headerService.HeaderData = {
      title: "Inspeções",
      icone: "fact_check",
      routeUrl: "/inspecoes",
    };
  }

  ngOnInit(): void {
    this.cacheUsuario = JSON.parse(localStorage.getItem("cacheUsuario"));
    this.getAllAgendamentoByUser();
  }

  getAllAgendamentoByUser(): void {
    this.agendamentoService
      .getAllAgendamentosByUsuario(this.cacheUsuario.login)
      .subscribe((agendamentos) => {
        this.agendamentos = agendamentos;
      });
  }

  ContinuarInsp(agendamento: any) {
    console.log(agendamento);
    localStorage.setItem("AgendaSeleted", JSON.stringify(agendamento));
    this.router.navigate(["/detalhe-inspecao"], { relativeTo: this.route });
  }

  transformDate(date, usaUltimaHora: boolean = false): string {
    return !usaUltimaHora
      ? this.datePipe.transform(date, "yyyy-MM-ddTHH:mm:ss")
      : this.datePipe.transform(date, "yyyy-MM-ddT23:59:59");
  }
}