import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { HeaderService } from "src/app/components/template/header/header.service";
import { AgendaInspManutDTO } from "src/app/models/AgendaInspManutDTO";
import { AgendamentoService } from "src/app/services/agendamento.service";
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  agendamentos: AgendaInspManutDTO[];
  IsLoading: boolean = true;
  AgendaPorStatus: { pendente: any[]; emAndamento: any[]; finalizado: any[]; total: any[] };
  AgendaAccPorStatus: any[];
  AgendaAccPorEmpresa: any[];
  EquipamentosInsp: any[];
  EquipamentosNotInsp: any[];
  EquipamentosInspQtd: any[];
  EquipamentosNotInspQtd: any[];
  displayedColumnsAccEmp: string[] = ['empresa', 'totalAcc'];
  displayedColumnsAccstat: string[] = ['status', 'total'];
  displayedColumnsAccInsp: string[] = ['empresa', 'totalInpecionados'];
  displayedColumnsAccNotInsp: string[] = ['empresa', 'totalNaoInpecionados'];
  date = new Date();
  primeiroDiaMes: Date;
  ultimoDiaMes: Date;
  totalNotInsp: number = 0;
  totalInsp: number = 0;
  agendamentosTotal: number = 0;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private headerService: HeaderService,
    private cdref: ChangeDetectorRef,
    private agendamentoService: AgendamentoService,
    private datePipe: DatePipe
  ) {
    headerService.HeaderData = {
      title: "Início",
      icone: "home",
      routeUrl: "/home",
    };
  }

  ngAfterViewInit(): void {
    this.cdref.detectChanges();
  }

  ngOnInit(): void {
    this.primeiroDiaMes = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.ultimoDiaMes = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    this.getAllAgendamentos();
    this.getAllEquipInspByDtAgendamento();
    this.getAllEquipNotInspByDtAgendamento();
    this.getAllQtdEquipInspByDtAgendamento();
    this.getAllQtdEquipNotInspByDtAgendamento();
  }

  getAllAgendamentos(): void {
    this.agendamentoService
      .getAllAgendamentoByDt(this.transformDate(this.primeiroDiaMes), 
      this.transformDate(this.ultimoDiaMes, true))
      .subscribe((agendamentos: AgendaInspManutDTO[]) => {
        this.agendamentos = agendamentos;
        this.agendamentosTotal = agendamentos.length;
        this.organizaDados();
      });
  }

  getAllEquipInspByDtAgendamento() : void {
    this.agendamentoService
    .getAllEquipInspByDtAgendamento(this.transformDate(this.primeiroDiaMes), 
    this.transformDate(this.ultimoDiaMes, true))
    .subscribe((agendamentos) => {
      this.EquipamentosInsp = agendamentos;
    });
  }

  getAllEquipNotInspByDtAgendamento() : void {
    this.agendamentoService
    .getAllEquipNotInspByDtAgendamento(this.transformDate(this.primeiroDiaMes), 
    this.transformDate(this.ultimoDiaMes, true))
    .subscribe((agendamentos) => {
      this.EquipamentosNotInsp = agendamentos;
    });  
  }

  getAllQtdEquipInspByDtAgendamento() : void {
    this.agendamentoService
    .getAllQtdEquipInspByDtAgendamento(this.transformDate(this.primeiroDiaMes), 
    this.transformDate(this.ultimoDiaMes, true))
    .subscribe((agendamentos) => {
      if(agendamentos){
        this.EquipamentosInspQtd = agendamentos
        agendamentos.forEach(agenda => this.totalInsp += agenda.totalInpecionados);
      }
    }); 
  }

  getAllQtdEquipNotInspByDtAgendamento() : void {
    this.agendamentoService
    .getAllQtdEquipNotInspByDtAgendamento(this.transformDate(this.primeiroDiaMes), 
    this.transformDate(this.ultimoDiaMes, true))
    .subscribe((agendamentos) => {
      if(agendamentos) {
        this.EquipamentosNotInspQtd = agendamentos;
        agendamentos.forEach(agenda => this.totalNotInsp += agenda.totalNaoInpecionados);        
      }
      this.IsLoading = !this.IsLoading;
    }); 
  }

  organizaDados(): void {
    this.AgendaPorStatus = this.agendamentos.reduce(
      function (acc, arr) {
       
        var index = acc.total.map((o) => o.status).indexOf(arr.statusInspManut);

        if(index == -1){
          acc.total.push(
            {
              status: arr.statusInspManut,
              total: 1
            }
          );
        }else {
          acc.total[index].total++;
        }

        if (arr.statusInspManut.match("Pendente")) {
          acc["pendente"].push(arr);
        }

        if (arr.statusInspManut.match("Em Andamento")) {
          acc["emAndamento"].push(arr);
        }

        if (arr.statusInspManut.match("Finalizado")) {
          acc["finalizado"].push(arr);
        }

        return acc;
      },
      { pendente: [], emAndamento: [], finalizado: [], total:[] }
    );

    this.AgendaAccPorStatus = this.agendamentos.reduce(
      function(acc, arr) {
       
        var index = acc.map((o) => o.status).indexOf(arr.statusInspManut);

        if(index == -1){
          acc.push(
            {
              status: arr.statusInspManut,
              total: 1
            }
          );
        }else {
          acc[index].total++;
        }   

        return acc;
      }, []);

    this.AgendaAccPorEmpresa = this.agendamentos.reduce(function (acc, arr) {
      var index = acc.map((o) => o.empresa).indexOf(arr.empresa);

      if (index == -1) {
        acc.push({
          empresa: arr.empresa,
          inspecoesAcc: arr.tipoAgendamento.match("Inspeção") ? 1 : 0,
          manutencoesAcc: arr.tipoAgendamento.match("Manutenção") ? 1 : 0,
          totalAcc:
            arr.tipoAgendamento.match("Inspeção") ||
            arr.tipoAgendamento.match("Manutenção")
              ? 1
              : 0,
        });
      } else {
        if (arr.tipoAgendamento.match("Inspeção")) {
          acc[index].inspecoesAcc++;
          acc[index].totalAcc++;
        } else {
          acc[index].manutencoesAcc++;
          acc[index].totalAcc++;
        }
      }

      return acc;
    }, []);
  }

  transformDate(date, usaUltimaHora: boolean = false): string {
    return !usaUltimaHora ?
    this.datePipe.transform(date, "yyyy-MM-ddTHH:mm:ss") :
    this.datePipe.transform(date, "yyyy-MM-ddT23:59:59")
  }
}
