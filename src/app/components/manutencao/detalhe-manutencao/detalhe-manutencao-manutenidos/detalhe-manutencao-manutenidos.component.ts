import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ManutencaoEquipamentoComponent } from '../manutencao-equipamento/manutencao-equipamento.component';
import { ManutencaoService } from 'src/app/services/manutencao.service';
import { ManutencaoDTO } from 'src/app/models/ManutencaoDTO';
import { ManutencaoEstadoService } from '../../manutencao-estado.service';

@Component({
  selector: 'app-detalhe-manutencao-manutenidos',
  templateUrl: './detalhe-manutencao-manutenidos.component.html',
  styleUrls: ['./detalhe-manutencao-manutenidos.component.css']
})
export class DetalheManutencaoManutenidosComponent implements OnInit {

  @Input() agendamentoId: any;
  EquipamentosInsp: any[];
  agendamentoSeleted: any;
  date = new Date();
  primeiroDiaMes: Date;
  ultimoDiaMes: Date;
  dataSource = new MatTableDataSource<any>(this.EquipamentosInsp);
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
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(
    private agendamentoService: AgendamentoService,
    public dialog: MatDialog,
    private manutencaoService: ManutencaoService,
    private estadoManutencao: ManutencaoEstadoService
  ) {
    this.estadoManutencao.isManutentionDone.subscribe((value) => {
      if (value) {
        this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));       
        this.getAllEquipManutByAgendamentoId();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.getAllEquipManutByAgendamentoId();
  }

  getAllEquipManutByAgendamentoId(): void {
    this.agendamentoService
      .getAllEquipManutByAgendamentoId(this.agendamentoSeleted.ageId.toString())
      .subscribe((agendamentos) => {
        if (agendamentos) {
          this.EquipamentosInsp = agendamentos
          this.dataSource.data = this.EquipamentosInsp;
        }
      });
  }

  openDialog(equipamento: any): void {
    this.manutencaoService
      .GetManutencaoByEquipIdAndAgeId(
        equipamento.equipamentoId,
        this.agendamentoSeleted.ageId.toString()
      )
      .subscribe((equipamentoManutencao: ManutencaoDTO) => {
        const dialogRef = this.dialog.open(ManutencaoEquipamentoComponent, {
          data: {
            equip: equipamento,
            dataIncial: this.date,
            manutencao: equipamentoManutencao,
          },
          autoFocus: true,
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log("The dialog was closed", result);
          if (result) {
            this.getAllEquipManutByAgendamentoId();
          }
        });
      });
  }

}
