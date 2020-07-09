import { Component, OnInit, ɵConsole } from '@angular/core';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../template/header/header.service';

@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.css']
})
export class ManutencaoComponent implements OnInit {
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
      title: "Manutenções",
      icone: "construction",
      routeUrl: "/manutencoes",
    };
  }

  ngOnInit(): void {
    this.cacheUsuario = JSON.parse(localStorage.getItem("cacheUsuario"));
    this.getAllAgendaByUserAndTipo();
  }

  getAllAgendaByUserAndTipo(): void {
    this.agendamentoService
      .getAllAgendaByUserAndTipo(this.cacheUsuario.login, '2')
      .subscribe((agendamentos) => {
        this.agendamentos = agendamentos;
      },
      (error) => {
        this.agendamentoService.showMessage("Ocorreu um erro ao buscar os agendamentos.", true);
      });
  }

  ContinuarManut(agendamento: any) {
    localStorage.setItem("AgendaSeleted", JSON.stringify(agendamento));
    this.router.navigate(["/detalhe-manutencao"], { relativeTo: this.route });
  }

  iniciarManut(agendamento: any) : void {
    this.agendamentoService.putAgendamentoStatusById(agendamento.ageId.toString(), '2').subscribe(
      () => {
        agendamento.statusAgenda = "Em Andamento";
        localStorage.setItem("AgendaSeleted", JSON.stringify(agendamento));
        this.router.navigate(["/detalhe-manutencao"], { relativeTo: this.route });
        this.agendamentoService.showMessage('Inspeção Em Andamento.');
      }
    );
  } 

  transformDate(date, usaUltimaHora: boolean = false): string {
    return !usaUltimaHora
      ? this.datePipe.transform(date, "yyyy-MM-ddTHH:mm:ss")
      : this.datePipe.transform(date, "yyyy-MM-ddT23:59:59");
  }

}
