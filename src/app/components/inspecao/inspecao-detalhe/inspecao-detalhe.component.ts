import { Component, OnInit } from "@angular/core";
import { AgendamentoService } from "src/app/services/agendamento.service";
import { DatePipe } from "@angular/common";
import { InspecaoEstadoService } from "../inspecao-estado.service";
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeReaderComponent } from '../../qr-code-reader/qr-code-reader.component';
import { EquipamentoSegurancaService } from 'src/app/services/EquipamentoSeguranca.service';
import { InspecaoEquipamentoComponent } from './inspecao-equipamento/inspecao-equipamento.component';

@Component({
  selector: "app-inspecao-detalhe",
  templateUrl: "./inspecao-detalhe.component.html",
  styleUrls: ["./inspecao-detalhe.component.css"],
})
export class InspecaoDetalheComponent implements OnInit {
  agendamentoSeleted: any;
  isFinishInspetion: boolean;
  isLoading: boolean;
  date = new Date();

  constructor(
    private estadoInspecao: InspecaoEstadoService,
    private agendamentoService: AgendamentoService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private equipamentoService: EquipamentoSegurancaService) {

    this.estadoInspecao.isInspetionDone.subscribe((value) => {
      if (value)
        this.agendamentoSeleted = JSON.parse(
          localStorage.getItem("AgendaSeleted")
        );
    });

    this.estadoInspecao.isAllInspetionDone.subscribe((value) => {
      this.isFinishInspetion = value;
    });
  }

  ngOnInit(): void {
    this.agendamentoSeleted = JSON.parse(localStorage.getItem("AgendaSeleted"));
  }

  finalizarAgendamento() {
    this.agendamentoService.putAgendamentoStatusById(this.agendamentoSeleted.ageId.toString(), '3').subscribe(
      () => {
        localStorage.removeItem("AgendaSeleted");
        this.router.navigate(["/inspecoes"], { relativeTo: this.route });
        this.agendamentoService.showMessage('Inspeção finalizada.');
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(QrCodeReaderComponent, {
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        var equipamento = JSON.parse(result);
         this.getEquipByNumExtintor(equipamento);
      }
    });
  }

  getEquipByNumExtintor(equipamento: any) : void {
    this.equipamentoService.getEquipByNumExtintor(equipamento.num_ext.toString()).subscribe
    ((extintor) =>{
      this.openDialogInspecao(extintor);
    });
  }

  openDialogInspecao(extintor : any): void {
    const dialogRef = this.dialog.open(InspecaoEquipamentoComponent, {
      data: {equip: extintor, dataIncial: this.date},
      autoFocus: true,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        this.agendamentoSeleted.qtdInsp++;
        this.agendamentoSeleted.qtdNotInsp--;
        localStorage.setItem("AgendaSeleted", JSON.stringify(this.agendamentoSeleted));
        this.estadoInspecao.isInspetionDone.next(true);
      }
    });
  }
}
