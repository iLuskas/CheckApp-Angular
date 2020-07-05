import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DatePipe } from "@angular/common";
import { AgendamentoService } from "src/app/services/agendamento.service";
import { InspecaoEstadoService } from "../../inspecao-estado.service";
import { InspecaoEquipamentoComponent } from "../inspecao-equipamento/inspecao-equipamento.component";
import { MatDialog } from "@angular/material/dialog";
import { InspecaoService } from "src/app/services/Inspecao.service";
import { InspecaoDTO } from "src/app/models/InspecaoDTO";
import { MatSort } from '@angular/material/sort';

@Component({
  selector: "app-inspecao-detalhe-inpecionados",
  templateUrl: "./inspecao-detalhe-inpecionados.component.html",
  styleUrls: ["./inspecao-detalhe-inpecionados.component.css"],
})
export class InspecaoDetalheInpecionadosComponent
  implements OnInit, AfterViewInit {
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
    private datePipe: DatePipe,
    private estadoInspecao: InspecaoEstadoService,
    public dialog: MatDialog,
    private inspecaoService: InspecaoService
  ) {
    this.estadoInspecao.isInspetionDone.subscribe((value) => {
      if (value) {
        this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
        console.log( this.agendamentoSeleted.ageId)
        
        this.getAllEquipInspByAgendamentoId();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.getAllEquipInspByAgendamentoId();
  }

  getAllEquipInspByAgendamentoId(): void {
    this.agendamentoService
      .getAllEquipInspByAgendamentoId(this.agendamentoSeleted.ageId.toString())
      .subscribe((agendamentos) => {
        if (agendamentos) {
          this.EquipamentosInsp = agendamentos
          this.dataSource.data = this.EquipamentosInsp;
        }
      });
  }

  openDialog(equipamento: any): void {
    this.inspecaoService
      .GetInspecaoByEquipIdAndAgeId(
        equipamento.equipamentoId,
        this.agendamentoSeleted.ageId.toString()
      )
      .subscribe((equipamentoInspecao: InspecaoDTO) => {
        console.log(equipamentoInspecao);
        const dialogRef = this.dialog.open(InspecaoEquipamentoComponent, {
          data: {
            equip: equipamento,
            dataIncial: this.date,
            inspecao: equipamentoInspecao,
          },
          autoFocus: true,
          disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log("The dialog was closed", result);
          if (result) {
            this.getAllEquipInspByAgendamentoId();
          }
        });
      });
  }
}
