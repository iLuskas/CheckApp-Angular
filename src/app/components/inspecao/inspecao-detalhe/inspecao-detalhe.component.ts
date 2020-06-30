import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inspecao-detalhe',
  templateUrl: './inspecao-detalhe.component.html',
  styleUrls: ['./inspecao-detalhe.component.css']
})
export class InspecaoDetalheComponent implements OnInit {
  agendamentoSeleted: any;
  date = new Date();
  primeiroDiaMes: Date;
  ultimoDiaMes: Date;
  EquipamentosInsp: any[];
  EquipamentosNotInsp: any[];
  constructor(
    private agendamentoService: AgendamentoService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.agendamentoSeleted = JSON.parse(localStorage.getItem('AgendaSeleted'));
    this.primeiroDiaMes = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.ultimoDiaMes = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

    this.getAllEquipInspByDtAgendamento();
    this.getAllEquipNotInspByDtAgendamento();
  }

  
  getAllEquipInspByDtAgendamento() : void {
    this.agendamentoService
    .getAllEquipInspByDtAgendamento(this.transformDate(this.primeiroDiaMes), 
    this.transformDate(this.ultimoDiaMes, true))
    .subscribe((agendamentos) => {
      this.EquipamentosInsp = agendamentos;
      console.log('NOTINSP',agendamentos);
    });
  }

  getAllEquipNotInspByDtAgendamento() : void {
    this.agendamentoService
    .getAllEquipNotInspByDtAgendamento(this.transformDate(this.primeiroDiaMes), 
    this.transformDate(this.ultimoDiaMes, true))
    .subscribe((agendamentos) => {
      this.EquipamentosNotInsp = agendamentos.filter(agenda => agenda.empresa.match(this.agendamentoSeleted.empresa));
    });  
  }


  transformDate(date, usaUltimaHora: boolean = false): string {
    return !usaUltimaHora ?
    this.datePipe.transform(date, "yyyy-MM-ddTHH:mm:ss") :
    this.datePipe.transform(date, "yyyy-MM-ddT23:59:59")
  }
}
