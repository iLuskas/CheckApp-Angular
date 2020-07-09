import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ManutencaoEquipamentoComponent } from '../manutencao-equipamento/manutencao-equipamento.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ManutencaoEstadoService } from '../../manutencao-estado.service';

@Component({
  selector: 'app-detalhe-manutencao-naomanutenidos',
  templateUrl: './detalhe-manutencao-naomanutenidos.component.html',
  styleUrls: ['./detalhe-manutencao-naomanutenidos.component.css']
})
export class DetalheManutencaoNaomanutenidosComponent implements OnInit {
  @Input() agendamentoIdNotInsp: any;
  ageId: any;
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
    "action",
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private agendamentoService: AgendamentoService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private estadoManutencao: ManutencaoEstadoService
  ) {
    this.estadoManutencao.isManutentionDone.subscribe((value) => {
      if (value){
        this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
        this.getAllEquipNotManutByAgendamentoId();
      } 
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void { 
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.getAllEquipNotManutByAgendamentoId();
  }

  getAllEquipNotManutByAgendamentoId(): void {
    this.agendamentoService
      .getAllEquipNotManutByAgendamentoId(this.agendamentoSeleted.ageId.toString())
      .subscribe((agendamentos) => {
        if (agendamentos) {
          this.EquipamentosNotInsp = agendamentos;
          this.dataSource.data = this.EquipamentosNotInsp;
          this.estadoManutencao.isAllManutentionDone.next(false);
        } else {
          this.dataSource.data = [];
          this.agendamentoService.showMessage(
            !this.agendamentoIdNotInsp 
            ? "Todos os Equipamentos foram Manutenidos. Por favor, finalize a inspeção."
            : "Todos os Equipamentos foram Manutenidos."
          );
          this.estadoManutencao.isAllManutentionDone.next(true);
        }
      });
  }

  openDialog(equipamento: any): void {
    const dialogRef = this.dialog.open(ManutencaoEquipamentoComponent, {
      data: { equip: equipamento, dataIncial: this.date },
      autoFocus: true,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      if (result) {    
        if (!this.agendamentoIdNotInsp) {
          this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
          this.agendamentoSeleted.qtdManut++;
          this.agendamentoSeleted.qtdNotManut--;
          localStorage.setItem(
            "AgendaSeleted",
            JSON.stringify(this.agendamentoSeleted)
          );
        }
        this.estadoManutencao.isManutentionDone.next(true);
      }
    });
  }
}
