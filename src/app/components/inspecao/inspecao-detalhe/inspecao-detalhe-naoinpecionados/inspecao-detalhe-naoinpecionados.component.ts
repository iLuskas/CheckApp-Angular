import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InspecaoEquipamentoComponent } from '../inspecao-equipamento/inspecao-equipamento.component';
import { InspecaoEstadoService } from '../../inspecao-estado.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-inspecao-detalhe-naoinpecionados',
  templateUrl: './inspecao-detalhe-naoinpecionados.component.html',
  styleUrls: ['./inspecao-detalhe-naoinpecionados.component.css']
})
export class InspecaoDetalheNaoinpecionadosComponent implements OnInit, AfterViewInit {
  @Input() Empresa: any
  EquipamentosNotInsp: any[];
  agendamentoSeleted: any;
  date = new Date();
  primeiroDiaMes: Date;
  ultimoDiaMes: Date;
  dataSource = new MatTableDataSource<any>(this.EquipamentosNotInsp);
  displayedColumns = [
    "numeroExtintor",
    "seloInmetroExtintor",
    "localizacao",
    "fabricanteExtintor",
    "tipoExtintor",
    "capacidadeExtintor",
    "anoFabricadoExtintor",
    "action"
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private agendamentoService: AgendamentoService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private estadoInspecao: InspecaoEstadoService
  ) {
    this.estadoInspecao.isInspetionDone.subscribe((value) => {
      if (value)
        this.getAllEquipNotInspByDtAgendamento();
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.primeiroDiaMes = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    this.ultimoDiaMes = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.getAllEquipNotInspByDtAgendamento();
  }

  getAllEquipNotInspByDtAgendamento() : void {
    this.agendamentoService
    .getAllEquipNotInspByDtAgendamento(this.transformDate(this.primeiroDiaMes), 
    this.transformDate(this.ultimoDiaMes, true))
    .subscribe((agendamentos) => {
      console.log(agendamentos)
      if(agendamentos) {
        this.EquipamentosNotInsp = agendamentos.filter(agenda => agenda.empresa.match(this.agendamentoSeleted.empresa));
        this.dataSource.data = this.EquipamentosNotInsp;
        this.estadoInspecao.isAllInspetionDone.next(false);
      }
      else {
        this.estadoInspecao.isAllInspetionDone.next(true);
        this.dataSource.data = [];
        this.agendamentoService.showMessage('Todos os Equipamentos foram inspecionados. Por favor, finalize a inspeção.');
      }
    });  
  }

  openDialog(equipamento: any): void {
    console.log(equipamento);
    const dialogRef = this.dialog.open(InspecaoEquipamentoComponent, {
      data: {equip: equipamento, dataIncial: this.date},
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        this.getAllEquipNotInspByDtAgendamento();
        this.agendamentoSeleted = JSON.parse(localStorage.getItem('AgendaSeleted'));
        this.agendamentoSeleted.qtdInsp++;
        this.agendamentoSeleted.qtdNotInsp--;
        localStorage.setItem("AgendaSeleted", JSON.stringify(this.agendamentoSeleted));
        this.estadoInspecao.isInspetionDone.next(true);
      }
    });
  }

  transformDate(date, usaUltimaHora: boolean = false): string {
    return !usaUltimaHora
      ? this.datePipe.transform(date, "yyyy-MM-ddTHH:mm:ss")
      : this.datePipe.transform(date, "yyyy-MM-ddT23:59:59");
  }

}
