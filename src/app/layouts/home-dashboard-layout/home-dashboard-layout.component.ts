import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { AgendaInspManutDTO } from "src/app/models/AgendaInspManutDTO";
import { HeaderService } from "src/app/components/template/header/header.service";
import { AgendamentoService } from "src/app/services/agendamento.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-home-dashboard-layout",
  templateUrl: "./home-dashboard-layout.component.html",
  styleUrls: ["./home-dashboard-layout.component.css"],
})
export class HomeDashboardLayoutComponent implements OnInit {
  agendamentos: AgendaInspManutDTO[];
  IsLoading: boolean = true;
  AgendaPorStatus: {
    pendente: any[];
    emAndamento: any[];
    finalizado: any[];
    total: any[];
  };
  AgendaAccPorStatus: any[];
  AgendaAccPorEmpresa: any[];
  EquipamentosInsp: any[];
  EquipamentosNotInsp: any[];
  EquipamentosInspQtd: any[];
  EquipamentosNotInspQtd: any[];
  displayedColumnsAccEmp: string[] = ["empresa", "totalAcc"];
  displayedColumnsAccstat: string[] = ["status", "total"];
  displayedColumnsAccInsp: string[] = ["empresa", "totalInpecionados"];
  displayedColumnsAccNotInsp: string[] = ["empresa", "totalNaoInpecionados"];
  date = new Date();
  totalNotInsp: number = 0;
  totalInsp: number = 0;
  agendamentosTotal: number = 0;
  constructor() {

  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {


  }


}
