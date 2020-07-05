import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { AgendamentoService } from "src/app/services/agendamento.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { InspecaoEquipamentoComponent } from "../inspecao-equipamento/inspecao-equipamento.component";
import { InspecaoEstadoService } from "../../inspecao-estado.service";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-inspecao-detalhe-naoinpecionados",
  templateUrl: "./inspecao-detalhe-naoinpecionados.component.html",
  styleUrls: ["./inspecao-detalhe-naoinpecionados.component.css"],
})
export class InspecaoDetalheNaoinpecionadosComponent
  implements OnInit, AfterViewInit {
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
    private estadoInspecao: InspecaoEstadoService
  ) {
    this.estadoInspecao.isInspetionDone.subscribe((value) => {
      if (value){
        console.log( this.agendamentoSeleted.ageId)
        this.getAllEquipNotInspByAgendamentoId();
      } 
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void { 
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
    this.getAllEquipNotInspByAgendamentoId();
  }

  getAllEquipNotInspByAgendamentoId(): void {
    this.agendamentoService
      .getAllEquipNotInspByAgendamentoId(this.agendamentoSeleted.ageId.toString())
      .subscribe((agendamentos) => {
        if (agendamentos) {
          this.EquipamentosNotInsp = agendamentos;
          this.dataSource.data = this.EquipamentosNotInsp;
          this.estadoInspecao.isAllInspetionDone.next(false);
        } else {
          this.estadoInspecao.isAllInspetionDone.next(true);
          this.dataSource.data = [];
          this.agendamentoService.showMessage(
            !this.agendamentoIdNotInsp 
            ? "Todos os Equipamentos foram inspecionados. Por favor, finalize a inspeção."
            : "Todos os Equipamentos foram inspecionados."
          );
        }
      });
  }

  openDialog(equipamento: any): void {
    console.log(equipamento);
    const dialogRef = this.dialog.open(InspecaoEquipamentoComponent, {
      data: { equip: equipamento, dataIncial: this.date },
      autoFocus: true,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed", result);
      if (result) {    
        if (!this.agendamentoIdNotInsp) {
          this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
          this.agendamentoSeleted.qtdInsp++;
          this.agendamentoSeleted.qtdNotInsp--;
          localStorage.setItem(
            "AgendaSeleted",
            JSON.stringify(this.agendamentoSeleted)
          );
        }
        this.estadoInspecao.isInspetionDone.next(true);
      }
    });
  }
}
