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
        this.primeiroDiaMes = new Date(
          this.date.getFullYear(),
          this.date.getMonth(),
          1
        );
        this.ultimoDiaMes = new Date(
          this.date.getFullYear(),
          this.date.getMonth() + 1,
          0
        );
        this.getAllEquipInspByDtAgendamento();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.primeiroDiaMes = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      1
    );
    this.ultimoDiaMes = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    );
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.getAllEquipInspByDtAgendamento();
  }

  getAllEquipInspByDtAgendamento(): void {
    this.agendamentoService
      .getAllEquipInspByDtAgendamento(
        this.transformDate(this.primeiroDiaMes),
        this.transformDate(this.ultimoDiaMes, true)
      )
      .subscribe((agendamentos) => {
        if (agendamentos) {
          console.log(agendamentos);
          this.EquipamentosInsp = agendamentos.filter((agenda) =>
            agenda.empresa.match(this.agendamentoSeleted.empresa)
          );
          console.log(this.EquipamentosInsp);
          this.dataSource.data = this.EquipamentosInsp;
        }
      });
  }

  openDialog(equipamento: any): void {
    this.inspecaoService
      .GetInspecaoByEquipIdAndAgeId(
        equipamento.equipamentoId,
        this.agendamentoSeleted.ageId
      )
      .subscribe((equipamentoInspecao: InspecaoDTO) => {
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
            this.getAllEquipInspByDtAgendamento();
          }
        });
      });
  }

  transformDate(date, usaUltimaHora: boolean = false): string {
    return !usaUltimaHora
      ? this.datePipe.transform(date, "yyyy-MM-ddTHH:mm:ss")
      : this.datePipe.transform(date, "yyyy-MM-ddT23:59:59");
  }
}
